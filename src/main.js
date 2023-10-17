import { createApp } from 'vue';
import App from './App.vue';
import * as Vue3Leaflet from 'vue3-leaflet';

const app = createApp(App);

// Registrar todos los componentes de vue3-leaflet
for (const componentKey in Vue3Leaflet) {
  app.component(componentKey, Vue3Leaflet[componentKey]);
}

app.mount('#app');
