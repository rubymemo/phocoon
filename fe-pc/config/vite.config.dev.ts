import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      port: 8080,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/admin': {
          target: 'https://admin.phocoongame.cn',
          changeOrigin: true,
        },
      }
    },
    // server: {
    //   open: true,
    //   fs: {
    //     strict: true,
    //   },
    //   proxy: {
    //     // '/admin': {
    //     //   target: 'http://10.9.58.22:8082',
    //     //   changeOrigin: true,
    //     // },
    //     // '/api/kechuang/': {
    //     //   target: proxyTarget,
    //     //   changeOrigin: true,
    //     //   // logLevel: 'debug',
    //     //   // onProxyRes: function (proxyRes, req, res) {
  
    //     //   //   let realUrl = proxyTarget + req.url;
    //     //   //   console.log('onProxyRes:'+realUrl)
    //     //   //   proxyRes.headers['x-real-url'] = realUrl;
    //     //   // },
    //     // },
    //   }
    // },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
