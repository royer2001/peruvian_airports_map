import { createApp } from 'vue';
import App from './App.vue';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"


// Importa también Vue3-Leaflet
import * as Vue3Leaflet from 'vue3-leaflet';

const app = createApp(App);

// Registra todos los componentes de Vue3-Leaflet globalmente
for (const componentKey in Vue3Leaflet) {
  app.component(componentKey, Vue3Leaflet[componentKey]);
}

app.mount('#app');
