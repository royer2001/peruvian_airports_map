<template>
  <div>

    <PresentationSection />


    <div class="container-fluid">
      <div class="row">
        <div class="col-6">
          <div style="height: auto; background: #F4F1E9; border: 1px solid red;">
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

                <l-marker v-for="({ latitude, longitud, airport_name }, index) in airports" :key="index"
                  :lat-lng="[parseFloat(latitude), parseFloat(longitud)]"
                  @click="handleMarkerClick(latitude, longitud, airport_name)">
                  <l-popup>
                    {{ airport_name }}
                  </l-popup>
                </l-marker>
                <!-- Agrega más marcadores según sea necesario -->
              </l-map>
            </div>
          </div>

        </div>
        <div class="col-6">
          <div
            style="background: lightcyan; height: 100%; border: 1px solid red; display: flex; flex-direction: column;"
            v-if="showCurrentInfo">
            <div style="margin: 10px;">
              <h3>Information</h3>
            </div>
            <div style="flex: 1; display: flex;">
              <div v-if="selectedAirportInfo" style="flex: 1; display: flex; flex-direction: column;">

                <div style="margin: 10px;">
                  <p>{{ selectedAirportInfo }}</p>
                  <p>latitude: {{ selectedLatitude }}</p>
                  <p>longitud: {{ selectedLongitud }}</p>
                </div>

                <div style="flex: 1;">
                  <l-map :key="mapKey" :options="mapOptions" :zoom="15" :center="[selectedLatitude, selectedLongitud]">
                    <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
                    <!-- Agrega más marcadores según sea necesario -->
                  </l-map>
                </div>
              </div>
              <img v-else src="" alt="no selected option info" style="flex: 1;">
            </div>
          </div>


        </div>
      </div>
    </div>
    <div class="container">
      <FooterSection />
    </div>
  </div>
</template>

<script>

import axios from 'axios';

import FooterSection from '@/components/FooterSection.vue'
import PresentationSection from '@/components/PresentationSection.vue'

export default {

  components: {
    FooterSection,
    PresentationSection
  },

  computed: {
    mapCenter() {
      // Use the selected marker coordinates if available, otherwise use default coordinates
      return this.selectedLatitude && this.selectedLongitud
        ? [parseFloat(this.selectedLatitude), parseFloat(this.selectedLongitud)]
        : [this.latitude, this.longitud];
    },
  },

  data() {
    return {

      mapKey: 0,

      zoom: 5,
      latitude: -9.1900,
      longitud: -75.0152,

      selectedLatitude: null,
      selectedLongitud: null,

      // showModalCreateLocation: false,
      showCurrentInfo: true,

      mapOptions: {
        dragging: false, // Desactiva el movimiento del mapa
        zoomControl: false, // Desactiva el control de zoom
        scrollWheelZoom: false,
      },

      selectedAirportInfo: '',

      airports: [
        {
          "icao": "SPME",
          airport_name: "Capitan FAP Pedro Canga Rodriguez Airport",
          latitude: -3.55253005027771,
          longitud: -80.38140106201172
        },
        {
          "icao": "SPYL",
          "airport_name": "Capitan Montes Airport",
          "latitude": -4.5766401290894,
          "longitud": -81.254096984863
        },
        {
          "icao": "SPUR",
          "airport_name": "Capitán FAP Guillermo Concha Iberico International Airport",
          "latitude": -5.20574998856,
          "longitud": -80.61640167239999
        },
        {
          "icao": "SPJR",
          "airport_name": "Mayor General FAP Armando Revoredo Iglesias Airport",
          "latitude": -7.1391801834106445,
          "longitud": -78.4894027709961
        },
        {
          "icao": "SPHI",
          "airport_name": "Capitan FAP Jose A Quinones Gonzales International Airport",
          "latitude": -6.787479877471924,
          "longitud": -79.8281021118164
        },
        {
          "icao": "SPPY",
          "airport_name": "Chachapoyas Airport",
          "latitude": -6.201809883117676,
          "longitud": -77.8561019897461
        },
        {
          "icao": "SPST",
          "airport_name": "Cadete FAP Guillermo Del Castillo Paredes Airport",
          "latitude": -6.508739948272705,
          "longitud": -76.37319946289062
        },
        {
          "icao": "SPRU",
          "airport_name": "Capitan FAP Carlos Martinez De Pinillos International Airport",
          "latitude": -8.08141040802002,
          "longitud": -79.10880279541016
        },
        {
          "icao": "SPHZ",
          "airport_name": "Comandante FAP German Arias Graziani Airport",
          "latitude": -9.347439765930176,
          "longitud": -77.59839630126953
        },
        {
          "icao": "SPQT",
          "airport_name": "Coronel FAP Francisco Secada Vignetta International Airport",
          "latitude": -3.7847399711608887,
          "longitud": -73.30879974365234
        },
        {
          "icao": "SPCL",
          "airport_name": "Cap FAP David Abenzur Rengifo International Airport",
          "latitude": -8.37794017791748,
          "longitud": -74.57430267333984
        },
        {
          "icao": "SPSO",
          "airport_name": "Capitán FAP Renán Elías Olivera International Airport",
          "latitude": -13.74489974975586,
          "longitud": -76.22029876708984
        },
        {
          "icao": "SPQU",
          "airport_name": "Rodríguez Ballón International Airport",
          "latitude": -16.3411006927,
          "longitud": -71.5830993652
        },
        {
          "icao": "SPHO",
          "airport_name": "Coronel FAP Alfredo Mendivil Duarte Airport",
          "latitude": -13.154800415039062,
          "longitud": -74.20439910888672
        },
        {
          "icao": "SPJL",
          "airport_name": "Inca Manco Capac International Airport",
          "latitude": -15.467100143432617,
          "longitud": -70.158203125
        },
        {
          "icao": "SPTU",
          "airport_name": "Padre Aldamiz International Airport",
          "latitude": -12.6135997772,
          "longitud": -69.2285995483
        },
        {
          "icao": "SPTN",
          "airport_name": "Coronel FAP Carlos Ciriani Santa Rosa International Airport",
          "latitude": -18.053300857500002,
          "longitud": -70.2758026123
        },
        {
          "icao": "SPHY",
          "airport_name": "Andahuaylas Airport",
          "latitude": -13.706399917602539,
          "longitud": -73.35040283203125
        },
        {
          "icao": "SPAY",
          "airport_name": "Teniente General Gerardo Pérez Pinedo Airport",
          "latitude": -10.7291,
          "longitud": -73.766502
        },
        {
          "icao": "SPEO",
          "airport_name": "Teniente FAP Jaime A De Montreuil Morales Airport",
          "latitude": -9.149609565734863,
          "longitud": -78.5238037109375
        },
        {
          "icao": "SPZO",
          "airport_name": "Alejandro Velasco Astete International Airport",
          "latitude": -13.535699844400002,
          "longitud": -71.9387969971
        },
        {
          "icao": "SPNC",
          "airport_name": "Alferez Fap David Figueroa Fernandini Airport",
          "latitude": -9.878809928894043,
          "longitud": -76.20480346679688
        },
        {
          "icao": "SPEQ",
          "airport_name": "Cesar Torke Podesta Airport",
          "latitude": -17.179000854492188,
          "longitud": -70.93080139160156
        },
        {
          "icao": "SPLO",
          "airport_name": "Ilo Airport",
          "latitude": -17.69499969482422,
          "longitud": -71.34400177001953
        },
        {
          "icao": "SPJE",
          "airport_name": "Shumba Airport",
          "latitude": -5.59248,
          "longitud": -78.774002
        },
        {
          "icao": "SPJJ",
          "airport_name": "Francisco Carle Airport",
          "latitude": -11.7831001282,
          "longitud": -75.47339630130001
        },
        {
          "icao": "SPJI",
          "airport_name": "Juanjui Airport",
          "latitude": -7.169099807739258,
          "longitud": -76.72859954833984
        },
        {
          "icao": "SPMF",
          "airport_name": "Mayor PNP Nancy Flores Paucar Airport",
          "latitude": -11.3254,
          "longitud": -74.535598
        },
        {
          "icao": "SPEP",
          "airport_name": "Puerto Esperanza Airport",
          "latitude": -9.7681303024292,
          "longitud": -70.70649719238281
        },
        {
          "icao": "SPJA",
          "airport_name": "Juan Simons Vela Airport",
          "latitude": -6.067860126495361,
          "longitud": -77.16000366210938
        },
        {
          "icao": "SPGM",
          "airport_name": "Tingo Maria Airport",
          "latitude": -9.133000373840332,
          "longitud": -75.94999694824219
        },
        {
          "icao": "SPCH",
          "airport_name": "Tocache Airport",
          "latitude": -8.1829996109,
          "longitud": -76.516998291
        },
        {
          "icao": "SPMS",
          "airport_name": "Moises Benzaquen Rengifo Airport",
          "latitude": -5.893770217895508,
          "longitud": -76.11820220947266
        },
        {
          "icao": "SPIM",
          "airport_name": "Jorge Chávez International Airport",
          latitude: -12.0219,
          longitud: -77.114305
        },
      ]
    }
  },


  methods: {

    refreshMap() {
      this.mapKey += 1;
    },

    toggleInfoSection() {
      this.showCurrentInfo = !this.showCurrentInfo;
    },

    handleMarkerClick(latitude, longitud, name) {
      this.selectedAirportInfo = name;
      this.selectedLatitude = latitude;
      this.selectedLongitud = longitud;
      this.refreshMap()

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

    getLocations() {
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
  background: #b7bac1;
  border-radius: 17px;
  height: 500px;
}
</style>