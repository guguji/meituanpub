const axios = require('axios');
const CryptoJS = require("crypto-js");

class meituanpub {

  /**初始化
   * @param {String} appKey 在美团分销平台申请得到的appKey
   * @param {String} utmSource 在美团分销平台申请得到的utmSource
   */
  constructor(appKey, utmSource) {
    this.appKey = appKey;
    this.utmSource = utmSource;
    this.aesKey = CryptoJS.enc.Utf8.parse(this.appKey); //aes密钥
  }

  /**AES加密  
   * @param {String} text 需要加密的数据
   * @return string
   */
  aesEncode(text) {
    let encryptedData = CryptoJS.AES.encrypt(text.toString(), this.aesKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encryptedData.ciphertext.toString();
  }

  /**AES解密
   * @param {String} hexData 需要解密的数据
   * @return string
   */
  aesDecode(hexData) {
    let encryptedHexStr  = CryptoJS.enc.Hex.parse(hexData);
    let encryptedBase64Str  = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decryptedData  = CryptoJS.AES.decrypt(encryptedBase64Str, this.aesKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decryptedData.toString(CryptoJS.enc.Utf8);
  }

  /**请求获得数据
   * @param api 请求接口
   * @param options 除公共参数以外的其他参数
   * @param method 
   * @param params 若method是post的情况下，params数据会覆盖默认get数据
   */
  request(api, options, method, params) {
    let timestamp = new Date().getTime();
    let data = {
      requestId: "id" + timestamp,
      utmSource: this.utmSource,
      version: "2.0",
      timestamp: timestamp,
      accessToken: this.aesEncode(this.utmSource + "" + timestamp),
    };

    //生成请求参数
    let axiosOption = {
      url: `https://union.dianping.com/${api}`, //请求地址
      method: method || 'GET',
    };
    if (axiosOption.method == "GET") {
      Object.keys(options).forEach((key) => {
        data[key] = options[key];
      });
      axiosOption.params = data;
    } else {
      params && Object.keys(params).forEach((key) => {
        data[key] = options[key];
      });
      axiosOption.params = data;
      axiosOption.data = options;
    }

    return new Promise((resolve, reject) => {
      axios(axiosOption).then(({ data }) => {
        resolve(data);
      }).catch((err) => {
        resolve({
          code: -1001,
          msg: err || "网络请求失败或者其他错误"
        });
      });
    })
  }

  /**生成推广链接
   * @param options 除utmSource参数以外的其他post参数
   */
  generateLink(options) {
    options.utmMedium = this.aesEncode(options.utmMedium);
    options.pageLevel = options.pageLevel || 1;
    options.utmSource =  this.utmSource;
    return this.request("api/promotion/link", options, "post");
  }
}

module.exports = meituanpub;