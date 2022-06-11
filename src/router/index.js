import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import { getStore } from '../config/mUtil.js'
const login = r => require.ensure([], () => r(require('../pages/login/login')), 'login')
const forget = r => require.ensure([], () => r(require('../pages/login/forget/forget')), 'login')
const captcha = r => require.ensure([], () => r(require('../pages/login/forget/captcha')), 'login')
const reset = r => require.ensure([], () => r(require('../pages/login/forget/reset')), 'login')
const yhfwxy = r => require.ensure([], () => r(require('../pages/login/protocol/yhfwxy')), 'yhfwxy')


const interest = r => require.ensure([], () => r(require('../pages/interest/interest')), 'interest')
const training = r => require.ensure([], () => r(require('../pages/training/training')), 'training')
const trainingpublish = r => require.ensure([], () => r(require('../pages/training/publish/publish')), 'trainingpublish')
const athletic = r => require.ensure([], () => r(require('../pages/athletic/athletic')), 'athletic')

const complete = r => require.ensure([], () => r(require('../pages/complete/complete')), 'complete')
const completeall = r => require.ensure([], () => r(require('../pages/complete/all/all')), 'completeall')
const completedetail = r => require.ensure([], () => r(require('../pages/complete/detail/detail')), 'completedetail')

// 活动完成页
const finish = r => require.ensure([], () => r(require('../pages/complete/finish/finish')), 'finish')

const my = r => require.ensure([], () => r(require('../pages/my/my')), 'my')

// 我的成员
const member = r => require.ensure([], () => r(require('../pages/member/member')), 'member')
const memberdetail = r => require.ensure([], () => r(require('../pages/member/detail/detail')), 'memberdetail')
const memberdetailedit = r => require.ensure([], () => r(require('../pages/member/detail/edit/edit')), 'memberdetail')
const memberaddschool = r => require.ensure([], () => r(require('../pages/member/addschool/addschool')), 'memberaddschool')
const membercertify = r => require.ensure([], () => r(require('../pages/member/certify/certify')), 'membercertify')
const memberinvite = r => require.ensure([], () => r(require('../pages/member/invite/invite')), 'memberinvite')

const scan = r => require.ensure([], () => r(require('../pages/scan/scan')), 'scan')

Vue.use(Router)
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new Router({
  routes: [
    {
      path: '/',
      component: App,
      children: [
        // {
        //   // path: '', redirect: '/'
        // },
        {//登录
          path: '/login', component: login,
          children: [{
            path: '/login/forget',//找回密码
            component: forget
          }, {
            path: '/login/captcha',//找回密码 发送验证码
            component: captcha
          }, {
            path: '/login/reset',//找回密码 重置密码
            component: reset
          }, {
            path: '/login/protocol/yhfwxy',//协议 用户服务协议
            component: yhfwxy
          }]
        },
        {//学生 首页 竞技场
          path: '/home', component: athletic
        },
        {//趣味
          path: '/interest', component: interest
        },
        {//学生 我来完成
          path: '/complete', component: complete,
          children: [
            {
              path: '/complete/all', component: completeall, children: [
                { path: '/complete/all/detail', component: completedetail }
              ]
            },
            { path: '/complete/detail', component: completedetail }
          ]
        },
        {//活动完成
          path: '/finish', component: finish,
        },
        {//运动
          path: '/training', component: training,
        },
        {//发布运动
          path: '/training/publish', component: trainingpublish
        },
        {// 我的
          path: '/my', component: my,
          children: [
            {
              path: '/my/member', component: member, children: [
                {
                  path: '/my/member/detail', component: memberdetail, children: [
                    { path: '/my/member/detail/edit', component: memberdetailedit },
                    // {
                    //   path: '/my/member/detail/addschool', component: memberaddschool, children: [
                    //     { path: '/my/member/detail/addschool/scan', component: scan }
                    //   ]
                    // }
                  ]
                },
                {
                  path: '/my/member/addschool', component: memberaddschool, children: [
                    { path: '/my/member/addschool/scan', component: scan },
                    { path: '/my/member/addschool/certify', component: membercertify },
                    { path: '/my/member/addschool/invite', component: memberinvite },
                  ]
                },
                // {path: '/my/member/certify', component: membercertify}
              ]
            }
          ]
        },
        // { path: '/my/member', component: member }
      ]
    }
  ]
})

export default router;