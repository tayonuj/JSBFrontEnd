/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';
import { createApp } from 'vue';


// import '@mdi/font/css/materialdesignicons.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import store from './store'; // Import the Vuex store
// import Chat from 'vue3-beautiful-chat'
import ConfirmPlugin from "./composables/plugins/ConfirmPlugin";
import VueNumerals from 'vue-numerals';
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import {createPinia, setActivePinia} from 'pinia'
import {Vue3ProgressPlugin} from '@marcoschulte/vue3-progress';
import Chat from 'vue3-beautiful-chat'
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import mitt from 'mitt';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import '@marcoschulte/vue3-progress/dist/index.css';
import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import '@fortawesome/fontawesome-free/scss/v4-shims.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';

import App from "./components/App.vue";
import router from "./router";

import Card from './components/bootstrap/Card.vue';
import CardBody from './components/bootstrap/CardBody.vue';
import CardHeader from './components/bootstrap/CardHeader.vue';
import CardFooter from './components/bootstrap/CardFooter.vue';
import CardGroup from './components/bootstrap/CardGroup.vue';
import CardImgOverlay from './components/bootstrap/CardImgOverlay.vue';
import CardExpandToggler from './components/bootstrap/CardExpandToggler.vue';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
const emitter = mitt();
import VideoBackground from 'vue-responsive-video-background-player'


/**
 * Next, we will create a fresh Vue application instance. You may then begin
 * registering components with the application instance so they are ready
 * to use in your application's views.
 * In the final stage we mount the root container as #app so the Blade file can link with the Vue file.
 */
const app = createApp(App);
app.use(createPinia());
app.use(router);


app.component('EasyDataTable', Vue3EasyDataTable);


app.component('Card', Card);
app.component('CardBody', CardBody);
app.component('CardHeader', CardHeader);
app.component('CardFooter', CardFooter);
app.component('CardGroup', CardGroup);
app.component('CardImgOverlay', CardImgOverlay);
app.component('CardExpandToggler', CardExpandToggler);
app.component('video-background', VideoBackground);
app.use(Chat);
app.use(Vue3ProgressPlugin)
app.use(PerfectScrollbar, {
    watchOptions: true,
    options: {
        suppressScrollX: true
    }
})
app.use(Toast);
app.use(store);
// app.use(Chat);
app.use(ConfirmPlugin);
app.use(LoadingPlugin);
app.use(VueNumerals);
app.config.globalProperties.$projectCode = "crp_intns_db_mahaweli_9_2_23";
app.provide('$projectCode', "crp_intns_db_mahaweli_9_2_23")
app.provide('$googleProperty', "Gg")

app.config.globalProperties.$googleProperty = "Gg";
app.config.globalProperties.emitter = emitter;

app.mount('#app');
