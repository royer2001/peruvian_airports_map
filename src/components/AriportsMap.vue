<template>
  <div class="container">
    <div class="my-4 p-5 bg-info text-white rounded">
      <h1>{{ headerPresentation.title }}</h1>
      <p>{{ headerPresentation.description }}</p>
    </div>

    <div class="row mb-4">
      <div class="col-6">
        <div style="height: 500px;">
          <h3 class="text-center">Peruvian Airports Map</h3>
          <l-map :options="mapOptions" :zoom="5" :center="[-9.1900, -75.0152]">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>

            <!-- Agregar marcadores -->
            <!-- <l-marker :lat-lng="[-12.0464, -77.0428]">
            <l-popup>
              Este es el mensaje que se muestra cuando haces clic en el marcador en Juliaca.
            </l-popup>
          </l-marker>  -->
            <!-- <l-marker :lat-lng="[13.6918, -89.2248]"></l-marker> -->

            <l-marker :lat-lng="[-15.470319163106165, -70.15666099196471]"
              @click="handleMarkerClick('JULIACA AIRPORT: INCA MANCO CAPAC AIRPORT')">
              <l-popup>
                JULIACA AIRPORT: INCA MANCO CAPAC AIRPORT
              </l-popup>
            </l-marker>

            <!-- Agrega más marcadores según sea necesario -->
          </l-map>
        </div>

      </div>
      <div class="col-6">
        <div>
          <div class="row">
            <div class="col-4">
              <button class="btn btn-primary" @click="resetInfo()">RESET</button>
            </div>
            <div class="col-4">
              <button class="btn btn-info" @click="fetchData()">OPEN IN MAPS</button>
            </div>
            <div class="col-4">
              <button class="btn btn-danger" @click="fetchData()">axios test</button>
            </div>

          </div>
          <h3>Information</h3>
          <section style="background: lightcyan; padding: 2rem;">
            <p v-if="selectedAirportInfo !== ''">{{ selectedAirportInfo }}</p>
            <img v-else src="" alt="no selected optin info">
          </section>

        </div>
      </div>
    </div>

    <div class="row my-4">
      <div class="col-12">
        <h1>end section</h1>
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

      headerPresentation: {
        title: 'PERUVIAN AIRPORTS',
        description: 'Learn about Peru airports.',
      },

      selectedAirportInfo: '',

    }
  },
  methods: {

    handleMarkerClick(airportInfo) {
      this.selectedAirportInfo = airportInfo;
    },

    disableScroll(event) {
      // Previene el evento de desplazamiento cuando el mouse está sobre el mapa
      event.preventDefault();
    },

    resetInfo(){
      this.selectedAirportInfo = "";
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