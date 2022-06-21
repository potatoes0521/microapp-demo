/*
 * @LastEditors: liu yang
 * @Description: 入口文件
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2022-06-21 13:43:07
 * @Author: 
 */
import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import config from "@/config";

// 创建Vue根实例
const app = createApp(App);

log(`WO 是否作为微应用调用`, window.__MICRO_APP_ENVIRONMENT__ ? "是" : "否");

// mock数据
if (process.env.VUE_APP_MODE === "dev") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

// 引入elementplus
// import "@/assets/css/el_var.scss";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";

// 引入svg图标
import "@/icons/index";

// 引入公共css
import "@/assets/css/index.scss";

// 生成唯一标识
import { createUniqueCode } from "@/utils/uniqueCode";
createUniqueCode();

// 动态路由加载
import "@/router/permission.js";

// 本地存储 Cookie SessionStorage localStorage

// 自定义指令注册 权限校验方法混入 按钮权限v-auth
// 各种自定义指令注册
import customDirective from "@/utils/directive";

// 引入 XiaoshiComponents
import {
  XIcon,
  XPanelContainer,
  XPanelTitle,
  XSearchForm,
  XSearchFormItem,
} from "@xiaoshi/xiaoshi-components";
import "@xiaoshi/xiaoshi-components/theme-chalk/index.css";
// 全局注册组件

// 以下为bpmn工作流绘图工具的样式
import "bpmn-js/dist/assets/diagram-js.css"; // 左边工具栏以及编辑节点的样式
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
// 属性面板
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
// 元素颜色
import "bpmn-js-color-picker/colors/color-picker.css";
// 鹰眼图
import "diagram-js-minimap/assets/diagram-js-minimap.css";

import "highlight.js/styles/stackoverflow-light.css";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage("javascript", javascript);

console.log(
  "%cXIAOSHI FE Welcome WO",
  "text-shadow: 0 1px 0 #WOc,0 1px 0 #c9c9c9,0 1px 0 #bbb,0 2px 0 #b9b9b9,0 3px 0 #aaa,0 4px 0.5px rgba(0,0,0,.1),0 0 3px rgba(0,0,0,.1),0 0.5px 2px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.2),0 3px 7px rgba(0,0,0,.25),0 7px 7px rgba(0,0,0,.2),0 15px 15px rgba(0,0,0,.15);font-size:3em"
);

// 本地存储 Cookie SessionStorage localStorage
app.config.globalProperties.$storage = storage;
// 不报警告
app.config.unwrapInjectedRef = true;

auth(app);
customDirective(app);

app
  .use(hljsVuePlugin)
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .use(XIcon)
  .use(XPanelContainer)
  .use(XPanelTitle)
  .use(XSearchForm)
  .use(XSearchFormItem)
  .use(auth)
  .mount("#app");

// 与基座进行数据交互
function handleMicroData(router) {
  // 是否是微前端环境
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // 主动获取基座下发的数据
    const microAppData = window.microApp.getData();
    console.log("wo getData", microAppData);
    window.parentRouter = microAppData.router;
    window.parentGetSys = microAppData.getSys;
    storage.setCookie("acToken", microAppData.wwwToken);
    store.dispatch("commitChangeUserInfo");

    // 监听基座下发的数据变化
    window.microApp.addDataListener(({ event, data }) => {
      switch (event) {
        case "routerPush":
          console.log("WO收：基座 routerPush", data);
          // 当基座下发path时进行跳转
          // eslint-disable-next-line no-case-declarations
          const pathArr = window.location.pathname.match(/\/qishi-.+/);
          // eslint-disable-next-line no-case-declarations
          const curRouterPath = (
            pathArr ? pathArr[0].replace(/\/$/, "") : "/"
          ).replace(/^\/qishi-[^/]+/, "");
          console.log("当前路由：", curRouterPath);
          if (data.path && data.path !== curRouterPath) {
            console.log("路由跳转", data.path, window.parentGetSys());
            if (window.parentGetSys().includes("qishi-wo")) {
              router.push(data.path);
            } else {
              window.parentRouter.push(`/qishi-wo${data.path}`);
            }
          }
          break;
        case "deleteCacheTabs":
          console.log("WO收：基座 deleteCacheTabs", data);
          store.dispatch("deleteCachesTabs", data);
          break;
        default:
          console.log("WO收：基座下发数据改变");
      }
    });

    // 监听缓存子应用重新渲染
    window.addEventListener("appstate-change", async function (e) {
      if (e.detail.appState === "afterhidden") {
        // console.log('已卸载')
      } else if (e.detail.appState === "beforeshow") {
        // console.log('即将重新渲染')
      } else if (e.detail.appState === "aftershow") {
        console.log("WO 已经重新渲染", router.currentRoute.value);
        const pathArr = window.location.pathname.match(/\/qishi-.+/);
        // eslint-disable-next-line no-case-declarations
        const curRouterPath = (
          pathArr ? pathArr[0].replace(/\/$/, "") : "/"
        ).replace(/^\/qishi-[^/]+/, "");
        const curRouter = router.currentRoute.value;
        if (curRouterPath === curRouter.fullPath) {
          if (curRouter.meta.keepAlive) {
            await store.dispatch("addCachesTabs", {
              id: curRouter.name,
              name: curRouter.meta.title,
              path: curRouter.path,
              fullPath: curRouter.fullPath,
              ssCode: curRouter.meta.ssCode,
            });
          }
          return;
        }
        // FIX: 2022年6月1日 
        // 修复bug
        // 其他子系统进入已经打开过得某个子系统的页面，就会丢失连接上的参数
        // eg: 主站打开CC  Apage  然后打开 WO  Bpage 然后回CC 某page  如果当前来个强提醒进入WO 工单详情 这里会丢失连接上参数
        // 在跳转的时候拼接参数
        const search = window.location.search || "";
        router.replace(curRouterPath + search);
      }
    });
  }
}

/**
 * 用于解决主应用和子应用都是vue-router4时相互冲突，导致点击浏览器返回按钮，路由错误的问题。
 * 相关issue：https://github.com/micro-zoe/micro-app/issues/155
 * 当前vue-router版本：4.0.12
 */
function fixBugForVueRouter4(router) {
  const go = router.go.bind(app);
  router.go = function (...arg) {
    console.log("router.go", arg);
    let data = store.getters.getCachesTabs.find((v) => {
      return (
        v.fullPath === window.history.state.current ||
        `/qishi-${config.appCode}${v.fullPath}` === window.history.state.current
      );
    });
    console.log("🚀 > file: main.js > line 206 > fixBugForVueRouter4 > window.history", window.history)
    go(...arg);
    if (arg[0] < 0 && config.isChildSystem && window.microApp) {
      console.log(
        "🚀 > file: main.js > line 210 > fixBugForVueRouter4 > data",
        data
      );
      window.microApp.dispatch({
        event: "removeCachesTabs",
        data: { ...data, ssCode: config.appCode },
      });
      // window.microApp.dispatch({
      //   event: "routerPush",
      //   data: { indexPath: window.history.state.back },
      // });
    }
  };
  // 判断主应用是 vue-router4，这里无需判断，因为主应用为 router4
  /**
   * 重要说明：
   * 1、这里主应用下发的基础路由为：`/main-xxx/app-vue3`，其中 `/main-xxx` 是主应用的基础路由，需要去掉，我们只取`/app-vue3`，不同项目根据实际情况调整
   *
   * 2、realBaseRoute 的值为 `/app-vue3`
   */
  // const realBaseRoute = window.__MICRO_APP_BASE_ROUTE__.replace(
  //   /^\/qishi-[^/]+/g,
  //   ""
  // );
  const realBaseRoute = window.__MICRO_APP_BASE_ROUTE__;

  router.beforeEach(() => {
    if (typeof window.history.state?.current === "string") {

      console.log(`🚀 > file: main.js > line 244 > router.beforeEach > ${config.appCode}${window.history.state.current}`, window.history);
      window.history.state.current = window.history.state.current.replace(
        new RegExp(realBaseRoute, "g"),
        ""
      );
    }
  });

  // router.afterEach(() => {
  //   if (typeof window.history.state === "object") {
  //     window.history.state.current =
  //       realBaseRoute + (window.history.state.current || "");
  //   }
  // });
}

if (window.__MICRO_APP_ENVIRONMENT__) {
  // Object.assign(window, window.rawWindow);

  handleMicroData(router);

  fixBugForVueRouter4(router);

  window.addEventListener("unmount", function () {
    app.unmount();
    log("WO 微应用卸载");
  });
}

function log(name, ...arg) {
  console.log(`%c[${name}]`, "color: red; font-style: italic", "\n", ...arg);
}
