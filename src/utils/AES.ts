import CryptoJS from "crypto-js";
 
// 定义接口类型，根据需要可自行定义，此处供参考
export interface CrypotoType {
    encryptCBC: any
    decryptCBC: any
}
 
export default class Crypoto implements CrypotoType {
    private EK = "307977E7203B9F1744C145B1F82217CD";
    private getHetKey() {
        return CryptoJS.enc.Utf8.parse(this.EK);
    }
    private keyHex = this.getHetKey()
 
 
    /** CBC加密 */
    encryptCBC(word: string) {
        if (!word) {
            return word;
        }
        const srcs = CryptoJS.enc.Utf8.parse(word);
        const encrypted = CryptoJS.AES.encrypt(srcs, this.keyHex, {
            iv: this.keyHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        return encrypted.toString(); 
    }
 
    /** CBC解密 */
    decryptCBC(word: string) {
        if (!word) {
            return word;
        }
        const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        const decrypt = CryptoJS.AES.decrypt(srcs, this.keyHex, {
            iv: this.keyHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }
}