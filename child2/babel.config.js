/*
 * @LastEditors:
 * @Description: babel配置文件
 *   @babel/plugin-proposal-nullish-coalescing-operator 解决null问题
 *   @babel/plugin-proposal-optional-chaining 解决可选项?
 *   dynamic-import-node 解决动态引入重复构建，开发环境import编译为require
 *   transform-remove-console 删除console，生产环境使用
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2021-09-29 17:44:26
 * @Author:
 */

const plugins = [
  "lodash",
  "@babel/plugin-proposal-nullish-coalescing-operator",
  "@babel/plugin-proposal-optional-chaining",
];

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  // 根据环境变量使用babel插件
  env: {
    development: {
      plugins: ["dynamic-import-node", ...plugins],
    },
    production: {
      plugins: ["transform-remove-console", ...plugins],
    },
    test: {
      plugins: [...plugins],
    },
  },
};
