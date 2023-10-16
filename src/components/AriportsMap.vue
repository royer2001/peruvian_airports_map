<template>

<div style="height: 500px; width: 400px;">
  <h3>Peruvian Airports</h3>
  <l-map :options="mapOptions" :zoom="5" :center="[-9.1900, -75.0152]" style="width: 100%; height: 400px; ">
    <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
    
    <!-- Agregar marcadores -->
    <!-- <l-marker :lat-lng="[-12.0464, -77.0428]">
      <l-popup>
        Este es el mensaje que se muestra cuando haces clic en el marcador en Juliaca.
      </l-popup>
    </l-marker>  -->
    <!-- <l-marker :lat-lng="[13.6918, -89.2248]"></l-marker> -->

    <l-marker :lat-lng="[-15.470319163106165, -70.15666099196471]">
      <l-popup>
        JULIACA AIRPORT: INCA MANCO CAPAC AIRPORT
      </l-popup>
    </l-marker>

    <!-- Agrega más marcadores según sea necesario -->
  </l-map>
  <button @click="fetchData()">axios test</button>
</div>
</template>

<script>

import axios from 'axios';


export default {
  
  data() {
    return {
      mapOptions: {
        dragging: false, // Desactiva el movimiento del mapa
        zoomControl: false, // Desactiva el control de zoom
        scrollWheelZoom: false,
      },
    }
  },
  methods:{
    disableScroll(event) {
      // Previene el evento de desplazamiento cuando el mouse está sobre el mapa
      event.preventDefault();
    },

    fetchData() {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        // Maneja la respuesta aquí
        console.log(response.data); // Ejemplo: Imprimir la respuesta en la consola
      })
      .catch(error => {
        // Maneja el error aquí
        console.error(error);
      });
    }
  }
};
</script>