/*
 * @LastEditors: liu yang
 * @Description: 入口文件
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2022-06-21 14:03:30
 * @Author:
 */
console.log("🚀 > file: main.js > line 14 > config", config)

import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import config from "@/config";
console.log("🚀 > file: main.js > line 14 > config", config)

// 创建Vue根实例
const app = createApp(App);

log(
  `${config.appCode} 是否作为微应用调用`,
  window.__MICRO_APP_ENVIRONMENT__ ? "是" : "否"
);

// 动态路由加载
import "@/router/permission.js";

// 不报警告
app.config.unwrapInjectedRef = true;

app.use(store).use(router).mount("#app");

// 与基座进行数据交互
function handleMicroData(router) {
  // 是否是微前端环境
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // 主动获取基座下发的数据
    const microAppData = window.microApp.getData();
    console.log("wo getData", microAppData);
    window.parentRouter = microAppData.router;
    window.parentGetSys = microAppData.getSys;

    // 监听基座下发的数据变化
    window.microApp.addDataListener(({ event, data }) => {
      switch (event) {
        case "routerPush":
          console.log("CC收：基座 routerPush", data);
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
          console.log("CC收：基座 deleteCacheTabs", data);
          store.dispatch("deleteCachesTabs", data);
          break;
        default:
          console.log("CC收：基座下发数据改变");
      }
    });

    // 监听缓存子应用重新渲染
    window.addEventListener("appstate-change", async function (e) {
      if (e.detail.appState === "afterhidden") {
        // console.log('已卸载')
      } else if (e.detail.appState === "beforeshow") {
        // console.log('即将重新渲染')
      } else if (e.detail.appState === "aftershow") {
        console.log("CC 已经重新渲染", router.currentRoute.value);
        // 这里这么处理 是因为有个 bug 在微应用中如
        // 打开A 系统  a 页面  打开B 系统  b 页面  然后菜单上直接点击进入A 系统  c 页面  这个时候不会触发路由变化 
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
        // eg: 主站打开CC  Apage  然后打开 CC  Bpage 然后回CC 某page  如果当前来个强提醒进入CC 工单详情 这里会丢失连接上参数
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
    console.log(
      "🚀 > file: main.js > line 206 > fixBugForVueRouter4 > window.history",
      window.history
    );
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
      console.log(
        `🚀 > file: main.js > line 244 > router.beforeEach > ${config.appCode}${window.history.state.current}`,
        window.history
      );
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
    log("CC 微应用卸载");
  });
}

function log(name, ...arg) {
  console.log(`%c[${name}]`, "color: red; font-style: italic", "\n", ...arg);
}
