import axios from 'axios';
import { createApp } from 'vue';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);
app.config.globalProperties.$store = store;
app
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .mount('#app');
