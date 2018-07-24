// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mock from './mock'
import ElementUI from 'element-ui'
import store from './vuex'
import Xss from 'xss'
//import 'element-ui/lib/theme-chalk/index.css'
import './assets/theme/green/index.css'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
//Mock.bootstrap()

/* eslint-disable no-new */
new Vue({
  //el: '#app',
  router,
  store,
  //components: { App },
  //template: '<App/>',
  render: h => h(App)
}).$mount('#app')
