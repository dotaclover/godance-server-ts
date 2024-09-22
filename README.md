# `Express` +`TypeScript` Web Server

## 快速开始

把项目克隆到本地,在根目录执行`npm run dev`就可以开始开发，项目使用了`ts-node-dev`进行热更新，代码有改动会自动重启。

如果在正式环境执行，先执行`npm install`，再执行`npm run build`，然后执行`npm start`。
这里直接使用`node dist/index.js`的方式，如果需要使用`pm2`之类的请自行修改。
如果`npm run build`报错，就是`TS`编译没通过，根据控制台输出的错误提示来修改吧，哈哈。