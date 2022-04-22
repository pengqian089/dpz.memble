import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import '@vant/touch-emulator';
import {handleResponse} from "./common";

router.beforeEach((to,_,next) =>{
    if (to.meta.title) {
        document.title = to.meta.title + " - 个人中心 - 叫我阿胖";
    }
    next()
});

const app = createApp(App);
app.config.globalProperties.$handleResponse = handleResponse;
app.use(store).use(router).use(Vant).mount('#app');

