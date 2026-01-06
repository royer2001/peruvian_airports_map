import { createApp } from 'vue';
import App from './App.vue';

// Design System Variables
import '@/assets/variables.css'

// Bootstrap and Icons
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Leaflet
import "leaflet/dist/leaflet.css";

// BootstrapVueNext
import { createBootstrap } from 'bootstrap-vue-next/plugins/createBootstrap'

const app = createApp(App);
app.use(createBootstrap())
app.mount('#app');
