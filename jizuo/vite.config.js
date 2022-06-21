/*
 * @LastEditors: liu yang
 * @Description: vite项目配置文件
 * @Date: 2022-03-02 16:00:21
 * @LastEditTime: 2022-06-21 13:39:33
 * @Author:
 */
import { defineConfig, loadEnv } from 'vite';

import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
// https://cn.vitejs.dev/config/
export default defineConfig((env) => {
  // env 环境变量
  const viteEnv = loadEnv(env.mode, `./env/.env.${env.mode}`);
  // console.log(viteEnv);

  return {
    base: viteEnv.VITE_BASE,
    server: {
      host: '0.0.0.0',
      port: '9001',
      open: true,
      // cors: true,
      // 端口占用直接退出
      strictPort: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        [viteEnv.VITE_BASE_URL]: {
          // 本地 8000 前端代码的接口 代理到 8888 的服务端口
          target: viteEnv.VITE_BASE_SERVER_URL,
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(viteEnv.VITE_BASE_URL, '/')
        }
      }
    },
    plugins: [vue()],
    // 插件
    envDir: './env',
    build: {
      outDir: 'dist',
      assetsDir: 'static/assets',
      // sourcemap: true,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      // 在生产环境移除console.log
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    // 别名设置
    resolve: {
      alias: {
        '@': resolve(__dirname, './src') // 把 @ 指向到 src 目录去
      }
    },
    css: {
      preprocessorOptions: {
        // 全局引入了 scss 的文件
        scss: {
          // additionalData: `
          // `,
          // javascriptEnabled: true
          additionalData: `
          `
        }
      }
    },
    optimizeDeps: {
      // 排除依赖项 https://cn.vitejs.dev/config/#optimizedeps-exclude
      exclude: [],
      // 强制预构建链接的包 https://cn.vitejs.dev/config/#optimizedeps-include
      include: []
    }
  };
});
