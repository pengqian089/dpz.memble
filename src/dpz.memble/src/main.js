import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import {
    auto as followSystemColorScheme
} from 'darkreader';
import store from "@/store"

followSystemColorScheme({
    brightness: 100,
    contrast: 90,
    sepia: 10
});

router.beforeEach((to,_,next) =>{
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
});

createApp(App).use(router).use(ElementPlus).use(store).mount('#app');
