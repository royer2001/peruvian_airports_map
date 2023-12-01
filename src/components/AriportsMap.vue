<template>
  <div class="container-fluid">
    <div class="my-2 p-5 bg-primary text-white rounded">
      <h1>{{ headerPresentation.title }}</h1>
      <p>{{ headerPresentation.description }}</p>
    </div>

    <div class="row mb-4">
      <div class="col-6">
        <div style="height: auto; background: #F4F1E9;">
          <h3 class="text-center">Peruvian Airports Map</h3>
          <div class="map-content">
            <l-map :options="mapOptions" :zoom="zoom" :center="[latitude, longitud]">
              <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>

              <!-- Agregar marcadores -->
              <!-- <l-marker :lat-lng="[-12.0464, -77.0428]">
              <l-popup>
                Este es el mensaje que se muestra cuando haces clic en el marcador en Juliaca.
              </l-popup>
            </l-marker>  -->
              <!-- <l-marker :lat-lng="[13.6918, -89.2248]"></l-marker> -->

              <l-marker v-for="(airport, index) in airports" :key="index"
                :lat-lng="[parseFloat(airport.latitude), parseFloat(airport.longitud)]"
                @click="handleMarkerClick(airport.name)">
                <l-popup>
                  {{ airport.name }}
                </l-popup>
              </l-marker>
              <!-- Agrega más marcadores según sea necesario -->
            </l-map>
          </div>
        </div>

      </div>
      <div class="col-6">
        <div>
          <div class="row">
            <div class="col-4">
              <button class="btn btn-primary" @click="resetInfo()">RESET</button>
            </div>
            <div class="col-4">
              <button class="btn btn-info" @click="toggleInfoSection()">OPEN IN MAPS</button>
            </div>
            <div class="col-4">
              <button class="btn btn-danger" @click="fetchData()">axios test</button>
            </div>

          </div>
          <section style="background: lightcyan; padding: 2rem;" v-if="showCurrentInfo">
            <h3>Information</h3>
            <div v-if="selectedAirportInfo !== ''">
              <p>{{ selectedAirportInfo }}</p>
              <l-map :options="mapOptions" :zoom="zoom" :center="[latitude, longitud]">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
                <!-- Agrega más marcadores según sea necesario -->
              </l-map>
            </div>

            <img v-else src="" alt="no selected optin info">
          </section>

          <section v-else>
            <ModalCreateLocation />
          </section>

        </div>
      </div>
    </div>

    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top"
      style="background-color: aquamarine;">
      <p class="col-md-4 mb-0 text-muted">&copy; 2023 conti, Inc</p>

      <a href="/"
        class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <svg class="bi me-2" width="40" height="32">
          <use xlink:href="#bootstrap" />
        </svg>
      </a>

      <ul class="nav col-md-4 justify-content-end">
        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Features</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Pricing</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">FAQs</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">About</a></li>
      </ul>
    </footer>

  </div>
</template>

<script>

import axios from 'axios';

import ModalCreateLocation from '@/components/ModalCreateLocation.vue'


export default {

  components: {
    ModalCreateLocation,
  },

  data() {
    return {

      zoom: 5,
      latitude: -9.1900,
      longitud: -75.0152,

      // showModalCreateLocation: false,
      showCurrentInfo: true,

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

      airports: [
        {
          longitud: '-77.114319',
          latitude: '-12.021889',
          code: 'LIM',
          name: 'Aeropuerto Internacional Jorge Chávez',
          city: 'Lima'
        },
        {
          longitud: '-76.201222',
          latitude: '-13.535722',
          code: 'CUZ',
          name: 'Aeropuerto Internacional Alejandro Velasco Astete',
          city: 'Cusco'
        },
        {
          longitud: '-70.158169',
          latitude: '-17.631611',
          code: 'AQP',
          name: 'Aeropuerto Internacional Rodríguez Ballón',
          city: 'Arequipa'
        },
        {
          longitud: '-70.15707',
          latitude: '-15.46751',
          code: 'JUL',
          name: 'Aeropuerto Internacional Inca Manco Capac',
          city: 'Juliaca'
        },
        
      ]
    }
  },
  methods: {

    toggleInfoSection() {
      this.showCurrentInfo = !this.showCurrentInfo;
    },

    handleMarkerClick(airportInfo) {
      this.selectedAirportInfo = airportInfo;
    },

    disableScroll(event) {
      // Previene el evento de desplazamiento cuando el mouse está sobre el mapa
      event.preventDefault();
    },

    resetInfo() {
      this.selectedAirportInfo = "";
      this.zoom = 5
      this.latitude = -9.1900
      this.longitud = -75.0152

      console.log(this.zoom, this.latitude, this.longitud)
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
    },

    //openModalCreateLocation(){
    //  this.showModalCreateLocation = true
    //}
  }
};
</script>

<style scoped>
.map-content {
  margin: 20px;
  padding: 20px;
  background: #c1beb7;
  border-radius: 17px;
  height: 500px;
}
</style>