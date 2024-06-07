import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './styles/index.scss';
import 'vue-cropper/dist/index.css';
import App from './App.vue';
import router from './router';
import { vuetify } from '@/plugins/vuetify';
import '@/plugins/pwa';
import Snackbar from '@/components/Snackbar/index.vue';
const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.use(router);
app.component('Snackbar', Snackbar);
app.mount('#app').$nextTick(() => {
    const d = document.getElementById('_loading_');
    d?.setAttribute('class', 'loading_ hide');
});
