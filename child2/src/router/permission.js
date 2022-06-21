/*
 * @LastEditors: liu yang
 * @Description: 处理递归权限路由
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2022-06-21 14:18:39
 * @Author:
 */
import router from "./index.js";
import store from "@/store";

router.beforeEach(async (to, from, next) => {
  console.log(
    "%c [ child2 登录成功 ] >",
    "font-size:13px; background:#006400; color:#FFF;",
    to,
    from
  );
  // const code = to.path.match(/^\/qishi-(\S*)\//);
  // if (
  //   (code?.length && code[1] !== config.appCode) ||
  //   to.fullPath === from.fullPath
  // ) {
  //   next(false);
  //   return;
  // }
  // keepAlive 是否需要缓存
  if (to.meta.keepAlive) {
    await store.dispatch("addCachesTabs", {
      id: to.name,
      name: to.meta.title,
      path: to.path,
      fullPath: to.fullPath,
      ssCode: to.meta.ssCode,
    });
  }
  next();
});
