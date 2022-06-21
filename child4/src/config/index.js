/*
 * @Author: 
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-09 15:58:50
 * @LastEditors: 
 * @LastEditTime: 2022-05-09 11:40:33
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 */
export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: "",
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 30,
  /**
   * @description api请求基础路径
   */
  nginxPath: process.env.VUE_APP_NGINX_PATH,
  baseUrl: process.env.VUE_APP_NGINX_PATH + process.env.VUE_APP_BASE_API,
  serverUrl: process.env.VUE_APP_SERVICE_HOST,
  mockBaseUrl: process.env.VUE_APP_MOCK_API,
  OSSUrl: process.env.VUE_APP_OSS,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: "login",
  companyName: "xiaoshi_",
  projectName: `qishi_${process.env.VUE_APP_CODE}_`,
  projectName_zh: process.env.VUE_APP_NAME, // "工单系统"
  isChildSystem: !!window.__MICRO_APP_ENVIRONMENT__,
  appCode: process.env.VUE_APP_CODE,
  navLogo: process.env.VUE_APP_NAV_LOGO,
  casUrl: `${process.env.VUE_APP_CAS_HOST}${process.env.VUE_APP_NGINX_PATH}/#/login`,
};
