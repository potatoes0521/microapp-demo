# Template-System-Vue3
<br />

## 简介

小石系统 CLI 模板，使用 Vue3+ElementPlus+Webpack 构建，适用于以单点登录为基础的平台系统。

<br />


## GIT

```bash
// GitLab
http://gitlab.beijingxiaoshi.cn/qianduan/components/vue3_init_cli

// ssh clone
git@192.168.200.205:qianduan/components/vue3_init_cli.git

// http clone
http://192.168.200.205/qianduan/components/vue3_init_cli.git
```

<br />

## 构建

```bash
npm config set registry http://192.168.200.206:8081/repository/group-npm/
npm install -g @xiaoshi/cli
xiaoshi -v
xiaoshi create <name>

// or

yarn config set registry http://192.168.200.206:8081/repository/group-npm/
yarn add -g @xiaoshi/cli
xiaoshi -v
xiaoshi create <name>

```

<br />

## 启动

```js
// 需根据项目配置对应env环境变量
npm run serve
// 启动StoryBook文档服务，需修改package.json中StoryBook启动端口，默认6006
npm run sb

// or

yarn serve
yarn sb
```

<br />

## 打包

```js
// 生产环境打包
npm run build
npm run build:prod
// 测试环境打包
npm run build:test
// 打包文档静态资源
npm run build-sb

// or

yarn build
yarn build:prod
yarn build:test
yarn build-sb
```

<br />

## 项目架构

### 目录结构

```bash
├── mock/                 模拟数据
├── public/               index.html入口
├── src                   核心代码文件夹
│   ├── api/                服务端接口配置文件夹
│   ├── assets/             静态资源
│   ├── components/         公共组件文件夹
│   ├── config/             项目配置文件
│   ├── icons/              图标配置 字体&SVG图标
│   ├── layout/             页面布局组件
│   ├── router/             路由文件夹
│   ├── store/              Vuex文件夹
│   ├── stories/            storyBook文档文件夹
│   ├── utils/              公用方法文件夹
│   ├── views/              页面文件夹
│   ├── main.js             项目入口文件
│   └── App.vue             项目模板入口
├── CHANGELOG.md          commit日志文件
├── README.md             项目说明文件
├── babel.config.js       babel配置文件
├── commitlint.config.js  commitlint检查文件
├── package.json          项目npm说明文件
├── jsconfig.json         js相关说明文件
└── vue.config.js         cli配置文件
```
文件模块详细信息请看下文

<br />

### 静态资源（src/assets） 

```bash
assets/
├─img/                图片资源
├─css/                公共css
|  ├─common.scss
|  ├─index.scss       css入口
|  ├─mixin.scss
|  ├─reset.scss
|  ├─transition.scss
|  ├─variables.scss
|  └─el_css/          ElementUI自定义样式
```


<br />

### 模拟数据（mock）

```base
mock/
├─index.js        mock接口配置文件
├─mock-server.js  mock服务
├─utils.js        mock公共方法
├─api/            mock接口文件
|  └this.js
```

**注：** `mock/api` 下文件名应与 `src/api/modules` 文件名一致，接口文件中请求地址也应保持一致，接口返回数据格式也应与服务接口一致

**示例：**

现 `src/api/modules` 下 this 模块（`this.js`） 存在侧边栏菜单接口，请求地址为 `/this/session/user-menu-tree`，开发模式下需使用 mock 数据

**配置：**

`mock/api` 下新建 `this.js` 文件，代码如下

```js
const menuList = [...]
module.exports = [
  // 菜单列表请求
  { 
    // 与服务器请求地址保持一致
    url: "/this/session/user-menu-tree", 
    type: "get",
    response: () => {
      // 应与服务接口返回的数据格式一致
      return { 
        code: 200,
        data: { menus: menuList },
        message: {
          code: "0000",
          msg: "菜单数据列表请求成功「mock」",
        },
      };
    },
  },
];
```

`mock/index.js` 中配置接口信息

引入 `mock/api/this.js` 文件，合并到 `mock/index.js` 文件的 mocks 数组中即可

```js
const mocks = [...require("./api/this")];

// 更多模块接口引入只需
// const mocks = [...require("./api/this"), ...require("./api/xxx"), ...];
```

mock 接口使用请看下文 `src/api` 中服务端接口配置

<br />

### 服务端接口配置（src/api） 
```base
api/
├─axios-mock.js   mock请求实例
├─axios.js        服务器请求实例
├─request.js      axios请求封装
├─modules/        接口请求模块文件夹
|    ├─demo.js
|    ├─perm.js
|    ├─this.js
|    └─user.js
```

**示例：**

新增一个侧边栏菜单接口，存在于 this 模块中，此接口开发模式下使用 mock 数据

**配置：**

首先在 `api/modules` 文件夹下新建 `this.js` 模块文件，如下

```js
import axios from "../axios";

// 获取当前用户菜单列表
export const getThisUserMenuTree = () => {
  return axios.get("/this/session/user-menu-tree")
};
```

上文 mock 数据中已配置菜单列表接口，这里只接使用即可。

由于 mock 数据需要 mock 请求本地 mock 服务，所以需要不同的 axios 实例，`src/api/mock-axios.js` 中已经配置好了（baseUrl不同），直接导出使用即可。

```js
import axiosMock from "../axios-mock";
```

侧边栏菜单请求接口最终配置如下

```js
import axios from "../axios";
import axiosMock from "../axios-mock";

// 是否为开发模式
const isDev = process.env.VUE_APP_MODE === "dev"

// 获取当前用户菜单列表
export const getThisUserMenuTree = () => {
  return isDev
    ? axiosMock.get("/this/session/user-menu-tree")
    : axios.get("/this/session/user-menu-tree");
};
```

**使用：**

```html
<template>...</template>
<script>
import {getThisUserMenuTree} from "@/api/this"
export default{
  methods:{
    async init(){
      await getThisUserMenuTree()
    }
  }
}
</script>
```

<be />

### 公共组件（src/components） 

公共组件以大驼峰形式命名，如下

```js
SvgIcon
```

**注：** 放置 `components` 目录下的组件需按照 `基础组件/业务组件/全局组件` 分类并在 `src/stories` 目录下书写文档留待后续组件迁移

<br />

### 项目配置（src/config）

项目名、打包hash戳、baseUrl等一些项目基础配置

<br />


### 图标配置（src/icons)
```bash
icons/
├─index.js                自动引入ElementUI2自带iconfont图标、iconfont图标、svg图标（注册SvgIcon组件）、引入公共icon
├─svg/                    svg图标文件夹
├─iconfont/               iconfont图标文件夹
|    ├─font/                iconfont图标字体文件夹
|    ├─css/                 iconfont图标css文件夹
├─public/                 公共icon文件夹，其目录结构&使用方法与icons文件夹一致
|   ├─index.js              自动引入ElementUI2自带iconfont图标、iconfont图标、svg图标
|   ├─el-iconfont.json      菜单图标列：ElementUI2自带iconfont图标
|   ├─iconfont.json         菜单图标列：iconfont图标
|   ├─svg-iconfont.json     菜单图标列：svg图标
|   ├─svg/                  svg图标文件夹
|   ├─iconfont/             iconfont图标文件夹          
```

**SVG图标引入：**

进入 [iconfont.cn](https://www.iconfont.cn/) 点击图标复制svg代码，在 `icons/svg` 文件夹下新建文件并粘贴 svg 代码，文件名必须以 `@` 开头

**SVG图标使用：**

使用全局组件 `SvgIcon`

```html
<template>
  <SvgIcon iconClass="svg文件名" className="类名"></SvgIcon>

  <SvgIcon iconClass="@notice" className="notice-class"></SvgIcon>
</template>
```

**字体图标引入：**

进入 [iconfont.cn](https://www.iconfont.cn/) 点击一个或多个图标加入购物车后，点击下载代码

解压文件

将相关字体文件放至 `icons/iconfont/font` 文件夹下

将 `iconfont.css` 修改名称并放至 `icons/iconfont/css` 文件夹下，修改 `iconfont.css` 文件中对字体图标的引入地址

**字体图标使用：**

下载后解压的 `iconfont.css` 文件内容如下

```css
@font-face {
  font-family: "iconfont"; /* Project id  */
  src: url('../font/news.ttf?t=1630911433239') format('truetype');
}

.iconfont {
  ...
}

.icon-atm:before {
  content: "\e69d";
}

.icon-xxx:before {
  content: "\e69d";
}
```

如上，`icon-atm & icon-xxx` 即图标名，使用时除了添加图标名的类，也要写 `iconfont` 类，如下

```html
<i class="iconfont icon-atm"></i>
<i class="iconfont icon-xxx"></i>
```

> **注意：**
>
> `icons/index.js` 文件在项目 `src/main.js` 文件中引入
>
> `icons/` 文件夹与其下的 `icons/public/` 文件夹下结构一致，使用方式一致
>
> 多项目通用图标请放置 `icons/public/` 文件夹下（如侧边栏、导航等图标），方便定期迁移同步
>
> **如图标是侧边栏菜单图标，需在 `icons/public/*.json` 中添加图标名，用以动态添加**


<br />

### 布局组件（src/layout）

```bash
layout/
├─css/                    布局容器组件样式
├─components/             组件
|     ├─Panel.vue         面板
|     ├─Sidebar           侧边栏
|     ├─Navbar            导航栏
├─index.vue               默认布局组件
```

<br />

### 路由管理（src/router）

```bash
router/
├─addRouter.js              动态添加路由文件
├─index.js                  路由入口，实例生成
├─permission.js             路由拦截
├─modules/                  路由项
|    ├─asyncRouter.js       菜单路由
|    ├─static.js            静态路由-无需登录
|    └─hideInMenuRouter.js  不需要菜单控制但是需要登录才能进入的界面 游离页面
```

<br />

### 状态管理（src/store）

```bash
store/
├─getters.js        全局 getters
├─index.js          Vuex实例入口
├─modules/          Vuex状态模块
|    ├─app.js
|    └─user.js
```

状态模块导出时，需开启命名空间参数 `namespaced: true`

index.js 文件夹中已自动导入`modules/` 文件夹下的模块，默认以 `modules/` 文件夹下文件名为模块命名空间，调用时需加上命名空间调用

具体使用请查看文档

<br />

### StoryBook文档管理（src/stories）

```base
stories/
├─docs/           项目文档说明
├─layout/         容器组件文档
├─components/     全局组件文档
├─business/       业务组件文档
├─base/           基础组件文档
└─assets/         文档所需静态资源
```

`stories/docs` 文件夹为项目公共文档，其中包含

- 快速了解
- 安装构建
- 模板文档（即当前文档）
- 项目文档（即项目开发完成后的项目文档）
- 开发规范
- ...

**基础组件**

基础组件是以单元模块构建的无耦合无强依赖组件，如完全自定义的按钮、弹框、布局、选择框等组件。此组件留待后期可无脑拆卸独立发布使用。

**注：** 基础组件都属于全局组件。

**业务组件**

业务组件即存在业务耦合的组件，通常只可在本项目复用，可依赖 UI 组件库。

**全局组件**

全局组件指基于 UI 库组件二次封装，如二次封装的按钮、弹框、布局、选择框等组件。

**注：** 全局组件不都是基础组件。

<br />

### 公共方法（src/utils）

`src/utils` 文件夹定义公共方法，请按照模块划分，尽量避免依赖，留待后续统一迁移封装


<br />

### 路由页面（src/views）

路由页面文件夹下页面文件，请遵循大驼峰命名方式，如下

```js
HomePage/
NoticePage/
```

页面私有组件请在页面文件夹下构建 `components` 选项

<br />