import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
import store from './vuex'
import * as api from './api/api'
import { Form, Field, Button, Checkbox, Toast, Icon, PasswordInput, NumberKeyboard, Divider, Cell, CellGroup, PullRefresh, Badge, Tab, Tabs, Image, Popup, ActionSheet, Stepper, Swipe, SwipeItem, SwipeCell, Grid, GridItem, Calendar, List, Dialog, Picker, uploader, DatetimePicker, Switch } from 'vant';
import 'vant/lib/index.less'
import 'lib-flexible'
import '../static/iconfont/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.$api = api;

Vue.use(VueRouter).use(Form).use(Field).use(Button)
  .use(Checkbox).use(Toast).use(Icon).use(PasswordInput).use(NumberKeyboard)
  .use(Divider).use(Cell).use(CellGroup).use(PullRefresh).use(Badge).use(Tab).use(Tabs)
  .use(Image).use(Popup).use(ActionSheet).use(Stepper).use(Swipe).use(SwipeItem)
  .use(SwipeCell).use(Grid).use(GridItem).use(Calendar).use(List).use(Dialog).use(Picker).use(uploader).use(DatetimePicker).use(Switch);
Toast.setDefaultOptions('loading', { className: "loading-toast", forbidClick: true, icon: "/static/image/loading.gif", duration: 0 });
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
