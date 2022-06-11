# sporter-demo

> A Vue.js project

## 项目运行

``` 
git clone http://47.97.62.149:9080/cnaiks/web.git

cd cnaiks-web

npm install

npm run start

```

### 项目布局

```
-- aiks-web
    |-- .babelrc
    |-- .gitignore
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- build // webpack打包配置
    |   |-- webpack.base.config.js 
    |   |-- webpack.dev.config.js
    |   |-- webpack.prod.config.js
    |-- config
    |   |-- index.js
    |-- dist // 上线项目文件, 放在服务器访问
    |   |-- index.html
    |   |-- static
    |-- src
    |   |-- App-2.vue // 前端页面入口文件
    |   |-- App.vue // 模型入口文件
    |   |-- main.js 
    |   |-- api
    |   |   |-- api.js
    |   |-- components // 组件
    |   |   |-- calendar // 日历
    |   |   |   |-- calendar.vue
    |   |   |   |-- swiper-monthorweek.vue
    |   |   |   |-- css
    |   |   |   |-- js
    |   |   |       |-- config.js
    |   |   |-- empty // 空页面
    |   |   |   |-- empty.vue
    |   |   |-- footer // 底部导航
    |   |   |   |-- foot.vue
    |   |   |   |-- image
    |   |   |-- header // 头部公共组件
    |   |   |   |-- head.vue
    |   |   |-- introduce-actionsheet // 运动须知弹窗
    |   |       |-- actionsheet.vue
    |   |-- config // 基本配置
    |   |   |-- env.js
    |   |   |-- mUtil.js
    |   |   |-- utils.js
    |   |-- pages 
    |   |   |-- athletic // 比一比
    |   |   |   |-- athletic.vue
    |   |   |-- complete // 我来完成
    |   |   |   |-- complete.vue
    |   |   |   |-- all // 全部活动
    |   |   |   |   |-- all.vue
    |   |   |   |-- detail // 活动详情
    |   |   |       |-- detail.vue
    |   |   |       |-- image
    |   |   |           |-- dashed.png
    |   |   |           |-- dashedlight.png
    |   |   |           |-- viewed.png
    |   |   |-- interest // 趣味运动
    |   |   |   |-- interest.vue
    |   |   |-- login //登录
    |   |   |   |-- login.vue
    |   |   |   |-- forget  // 忘记密码
    |   |   |   |   |-- captcha.vue // 输入验证码
    |   |   |   |   |-- forget.vue // 输入手机号
    |   |   |   |   |-- reset.vue // 密码重置
    |   |   |   |-- image
    |   |   |   |   |-- bottom.png
    |   |   |   |   |-- left.png
    |   |   |   |   |-- top.png
    |   |   |   |-- protocol
    |   |   |       |-- yhfwxy.vue
    |   |   |-- student 
    |   |   |   |-- my // 学生我的页面
    |   |   |       |-- my.vue
    |   |   |       |-- image
    |   |   |-- training // 运动
    |   |       |-- training.vue
    |   |       |-- publish // 设定运动
    |   |           |-- publish.vue
    |   |           |-- image
    |   |               |-- active.png
    |   |               |-- arrow.png
    |   |-- request // 请求封装
    |   |   |-- http.js
    |   |-- router //路由
    |   |   |-- index.js
    |   |-- sport // 运动模型
    |   |   |-- canvasdraw
    |   |       |-- CanvasDraw.js
    |   |-- store // 状态管理
    |-- static //静态资源
        |-- css
        |-- iconfont
        |-- image

```