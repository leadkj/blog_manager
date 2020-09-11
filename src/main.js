import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.less'
import axios from 'axios'
import VueEditor from 'vue2-editor'

Vue.use(VueEditor)
//配置axios 请求根路径
axios.defaults.baseURL = 'http://127.0.0.1/api/v1/'
axios.interceptors.request.use(config=>{
    config.headers.Authorization = 'Bearer '+window.sessionStorage.getItem('token')
    // console.log(config);
    return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
window.eventBus = new Vue()
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
