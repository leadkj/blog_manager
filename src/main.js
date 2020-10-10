import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.less'
import axios from 'axios'
import VueEditor from 'vue2-editor'
import {Loading} from "element-ui";

let loading;

export function startLoading()
{
    loading = Loading.service({
        lock: true,
        text: '加载中......',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export  function closeLoading()
{
    loading.close()
}

Vue.use(VueEditor)
//配置axios 请求根路径
axios.defaults.baseURL = 'http://127.0.0.1/api/v1/'
axios.interceptors.request.use(config => {
    startLoading()
    config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
    // console.log(config);
    return config
})
axios.interceptors.response.use(config=>{
    closeLoading()
    return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
window.eventBus = new Vue()
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
