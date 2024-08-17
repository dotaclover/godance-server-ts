# 一个`Express`服务器模板

## 快速开始

把项目克隆到本地,在根目录执行`npm run dev`就可以开始开发，项目使用了`ts-node-dev`进行热更新，代码有改动会自动重启。

如果在正式环境执行，先执行`npm install`，再执行`npm start`。
如果`npm run build`报错，就是 TS 编译没通过，根据控制台输出的错误修改只，哈哈。

## 一些使用的类库

- `config`
  使用`config`库管理配置文件，主要特点是有默认配置、不同环境对就不同的配置。
  可以通过`custom-environment-variables.json`来设置从环境变量中读取配置。
  项目地址:`https://github.com/node-config/node-config`
- `winston`
  使用`winston`库管理日志，主要特点是可以配置多管道输出,可以记录`Unhandled Exception`和`Unhandled Rejection`。
  `Unhandled Exception`和`Unhandled Rejection`会导致程序崩溃，通过`winston`把这两个错误记录到对应的文件中方便检查。
  项目地址:`https://github.com/winstonjs/winston`
- `morgan`
  使用`morgan`记录`access log`，把日志打到控制台或文件中，在开发中比较实用。
  项目地址:`https://github.com/expressjs/morgan`
- `helmet`
  使用`helmet`加强网站安全，它会自动在`Http`返回中加上一组网络安全相关的`headers`，防止网站被滥用。
  项目地址：`https://github.com/helmetjs/helmet`
- `moment`
  `moment`是一个处理日期的库，项目地址:`https://github.com/moment/moment`
- `lodash`
  `lodash`是一个强大的`JS`工具类库，项目地址:`https://github.com/lodash/lodash`
- `joi`
  `joi`是`NodeJS`是一个强大的`JS`验证工具库，项目地址:`https://github.com/hapijs/joi`
- `jsonwebtoken`
  使用`jsonwebtoken`来生成、验证`Web Token`，项目地址:`https://github.com/auth0/node-jsonwebtoken`
- `mongoose`
  使用`mongoose`来操作 MongoDB，项目地址:`https://github.com/Automattic/mongoose`
