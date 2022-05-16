import { defineStore } from 'pinia';
import { createStorage } from '@/utils/Storage';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN } from '@/store/mutation-types';

const Storage = createStorage({ storage: localStorage });
import { getUserInfo, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: any;
  roles: any[];
}

export interface UserInfoData {
  userId: string | number;
  username: string;
  realName?: string;
  avatar: string;
  desc?: string;
  password: string;
  token: string;
  permissions: any[];
  role: {}
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: Storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: Storage.get(CURRENT_USER, {}),
    roles: []
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): object {
      return this.info;
    },
    getRoles(): [any][] {
      return this.roles
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info) {
      this.info = info;
    },
    // 登录
   login(userInfo) {
     return new Promise<Object>((resolve, reject) => {
       login(userInfo).then(response => {
         const ex = 7 * 24 * 60 * 60 * 1000;
         storage.set(ACCESS_TOKEN, response.accessToken, ex);
         storage.set(CURRENT_USER, response.data, ex);
         storage.set(IS_LOCKSCREEN, false);
         this.setToken(response.token);
         this.setUserInfo(response.data);
         response.code = 0
         response.message = '登录成功'
          resolve(response);
       })
       .catch((e) => {
          reject(e);
       })
     })
       
    },

    // 获取用户信息
    GetInfo() {
      const that = this;
      return new Promise<Object>((resolve, reject) => {
        getUserInfo({}).then(response => {
            
            const result: UserInfoData = {
              userId: response.data.data.id,
              username: response.data.data.nickName,
              realName: response.data.data.nickName,
              avatar: response.data.data.picUrl,
              password: response.data.data.password,
              token: response.data.accessToken,
              permissions: response.data.data.permissionList.filter((item) => item.parentId == -1).map((permission) => {
                return {
                  label: permission['displayName'],
                  value: permission['name']
                }
              }),
              role: response.data.data.role
            }
            if (result.permissions && result.permissions.length) {
              let menuPermissionList: any[] = []
              let actionPermissionList: any[] = []
              menuPermissionList = result.permissions.filter((item) => item.parentId == -1)
              actionPermissionList = result.permissions.filter((item) => item.parentId !== -1)
              const role = result.role
              role['permissionList'] = menuPermissionList.map((permission) => {
                return {
                  label: permission['displayName'],
                  value: permission['name']
                }
              })
              role['actionPermissionList'] = actionPermissionList.map((permission) => {
                return {
                  label: permission['displayName'],
                  value: permission['name']
                }
              })
              
              that.setPermissions(role['permissionList']);
              that.setUserInfo(result);
            } else {
              reject(new Error('getInfo: permissionsList must be a non-null array !'));
            }
            that.setAvatar(result.avatar);
            console.log('result :>> ', result);
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo('');
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      return Promise.resolve('');
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}


export interface resultData {
  code: number,
  msh: string,
}