import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
Vue.config.productionTip = false
import {
  Slider
} from 'vant';
Vue.use(Slider);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')