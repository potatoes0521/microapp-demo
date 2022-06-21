/*
 * @LastEditors: 
 * @Description: WindiCSS 配置
 * @Date: 2022-03-08 14:56:36
 * @LastEditTime: 2022-03-22 17:06:08
 * @Author: 
 */
// 英文文档：https://windicss.org
// 中文文档：https://cn.windicss.org
// 工具类文档：https://cn.windicss.org/utilities/
import { defineConfig } from 'vite-plugin-windicss';
import { transform } from 'windicss/helpers';
// import colors from 'windicss/colors';

export default defineConfig({
  // 属性模式 https://cn.windicss.org/features/attributify.html
  //   如使用属性模式，请按照下面基于可变修饰分组来使用，即指使用下面4个属性，确保项目统一
  //     class=...
  //     sm=...
  //     md=...
  //     dark=...
  attributify: {
    // ‘w’ => w:bg="blue-400"
    prefix: ''
  },
  // media - 使用浏览器内置 @media (prefers-color-scheme: dark) 查询，会与用户的系统表现相匹配
  // class - 侦测父元素的 class="dark"，通常你可以将它放置在 html/body 元素上使全局生效
  //   document.documentElement.classList.add('dark')
  darkMode: 'class',
  transformCSS: 'pre',
  extract: {
    include: ['**/*.{vue,html,jsx,tsx,ts}'],
    exclude: ['node_modules', '.git', 'excluded', 'dist', 'windi.config.{ts,js}', 'tailwind.config.{ts,js}']
  },
  // 别名 < 快捷方式，不支持复杂嵌套CSS https://windicss.org/posts/v30.html#alias-config
  //   使用: {xxx: 'bg-400 flex ...'} => class="*xxx"
  alias: {},
  // 快捷方式 支持复杂CSS嵌套 https://cn.windicss.org/features/shortcuts.html
  //   使用: {xxx: 'bg-400 flex ...'} => class="xxx"
  shortcuts: {},
  // 主题
  //   theme() 方法可获取定义值：background-color: theme("colors.blue.500");
  theme: {
    // 扩展
    extend: {
      zIndex: {
        '-1': '-1'
      },
      colors: {}
    }
  },
  plugins: [
    // 官方 - 多行文字溢出插件 使用：https://cn.windicss.org/plugins/official/line-clamp.html
    transform('windicss/plugin/line-clamp'),
    // 官方 - 排版工具类插件 使用：https://cn.windicss.org/plugins/official/typography.html
    transform('windicss/plugin/typography'),
    // 滚动条插件 使用：https://cn.windicss.org/plugins/community/scrollbar.html
    transform('@windicss/plugin-scrollbar')
  ]
});

// default                                               dark
// lightBlue['400']                   主色
// emerald['400'] - lightBlue['400']  渐变色              dark['900'] - dark['400']
// light['50']                        面板色              dark['300']
// light['500']                       面板背景色          dark['50']
