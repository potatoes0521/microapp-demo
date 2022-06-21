/*
 * @LastEditors: 
 * @Description: 软电话暴露接口
 * @Date: 2021-10-15 18:22:43
 * @LastEditTime: 2022-04-18 18:50:21
 * @Author: 
 */

/**
 * @Author 
 * @Date 2021-10-15 18:44:53
 * @description 软电话外部暴露类
 * @return {*}
 */
function SoftPhoneExternal() { }

/**
 * @Author 
 * @Date 2021-10-15 18:43:59
 * @description 外拨
 * @param {String} [phone] 以字符串0开头的号码
 * @return {*}
 */
SoftPhoneExternal.prototype.qutwardDialing = function (phone, logId) {
  if (!window?.wssp?.isLogin) return;
  if (!phone) {
    window.isCallbackLogId = logId;
    window.wssp.callSPFunction(3);
    return;
  }
  window.wssp.dial(phone);
};

export default new SoftPhoneExternal();
