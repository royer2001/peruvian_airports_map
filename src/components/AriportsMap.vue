<template>
<<<<<<< HEAD
  <div class="container">
    <div class="my-4 p-5 bg-info text-white rounded">
=======
  <div>
    <div class="m-2 p-5 bg-primary text-white rounded">
>>>>>>> f793d7ac3c7d9f556bbd8c07c70619c81ab911e6
      <h1>{{ headerPresentation.title }}</h1>
      <p>{{ headerPresentation.description }}</p>
    </div>

    <div class="container-fluid">
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
                <button :class="showCurrentInfo ? 'btn btn-info' : 'btn btn-success' " @click="toggleInfoSection()">{{showCurrentInfo ? 'info' : 'create'}}</button>
              </div>
              <div class="col-4">
                <button class="btn btn-danger" @click="fetchData()">axios test</button>
              </div>

            </div>
            <section style="background: lightcyan; padding: 2rem;" v-if="showCurrentInfo">
              <h3>Information</h3>
              <div v-if="selectedAirportInfo">
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
    </div>
<<<<<<< HEAD

    <div class="row my-4">
      <div class="col-12">
        <h1>end section</h1>
      </div>
    </div>

=======
    
    <div class="container">
      <FooterSection/>
    </div>
>>>>>>> f793d7ac3c7d9f556bbd8c07c70619c81ab911e6
  </div>
</template>

<script>

import axios from 'axios';

import ModalCreateLocation from '@/components/ModalCreateLocation.vue'
import FooterSection from '@/components/FooterSection.vue'

export default {

  components: {
    ModalCreateLocation,
    FooterSection,
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

    getLocations(){
      // TODO: get all locations
    }

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
}</style>