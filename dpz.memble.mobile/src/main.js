import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import '@vant/touch-emulator';
import {handleResponse} from "./common";

const app = createApp(App);
app.config.globalProperties.$handleResponse = handleResponse;
app.use(store).use(router).use(Vant).mount('#app');

