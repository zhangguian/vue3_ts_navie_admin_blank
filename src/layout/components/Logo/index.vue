<template>
  <div class="logo">
    <!-- <img src="~@/assets/images/logo.png" alt="" :class="{ 'mr-2': !collapsed }" /> -->
    <h2 v-show="!collapsed" class="title">钢卷生产管理系统</h2>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    props: {
      collapsed: {
        type: Boolean,
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '@/styles/index.less';

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;
    background-color: @primaryColor;
    color: #fff;
    img {
      width: auto;
      height: 32px;
    }

    .title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 0;
    }
  }
</style>
