// resources/js/login.js
import { createApp } from 'vue';
import Login from './components/Authentication/Login.vue';
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";

const app = createApp(Login);
// const vuetify = createVuetify({
//     // theme: {
//     //     defaultTheme: 'dark',
//     // },
//     components,
//     directives,
// })
// app.use(vuetify); // Use Vuetify as a plugin
app.use(Toast);
app.mount('#login-app');
