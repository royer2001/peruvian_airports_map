<template>
<div class="container">

  <div class="row">
    <div class="col-6">
      <div>
        <h3 class="text-center">Peruvian Airports</h3>
        <l-map :options="mapOptions" :zoom="5" :center="[-9.1900, -75.0152]">
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
      </div>
      
      <div class="row">
        <div class="col-4">
          <button class="btn btn-primary" @click="fetchData()">axios test</button>
        </div>
        <div class="col-4">
          <button class="btn btn-info" @click="fetchData()">axios test</button>
        </div>
        <div class="col-4">
          <button class="btn btn-danger" @click="fetchData()">axios test</button>
        </div>
        
      </div>
      
    </div>
    <div class="col-6">
      <div>
        <h3>Information</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis, culpa facilis! Unde omnis fuga corporis dolores cupiditate, enim assumenda alias id aspernatur laudantium neque quibusdam eaque blanditiis veniam est repellat.
        </p>
      </div>
    </div>
  </div>

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