<template>
  <div>
    <PreLoader :isLoading="isLoading"></PreLoader>
    <HeaderSection />
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-md-6 col-sm-12">
          <div class="card-map">
            <div class="d-flex align-items-center">
              <div class="col-4 d-flex justify-content-start">
                <img src="@/assets/peru_flag.svg" class="m-1" style="width: 30px;" alt="">
              </div>
              <div class="col-8 d-flex align-items-center justify-content-start">
                <h5 class="text-center m-0">AIRPORT MAP</h5>
              </div>

            </div>

            <div class="map-content">
              <l-map :options="mapOptions" :zoom="zoom" :center="[latitude, longitud]">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
                <l-marker v-for="({ latitude, longitud, airport_name, icao }, index) in airports" :key="index"
                  :lat-lng="[parseFloat(latitude), parseFloat(longitud)]" @click="handleMarkerClick(icao)">
                  <l-popup>{{ airport_name }}</l-popup>
                </l-marker>
              </l-map>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="card-info" v-if="showCurrentInfo">
            <div style="flex: 1; display: flex;">
              <div v-if="selectedAirportInfo" style="flex: 1; display: flex; flex-direction: column;">
                <div class="map-details">
                  <l-map style="height: 20%; width: 100%" :key="mapKey" :options="mapOptions" :zoom="15"
                    :center="[selectedAirportInfo.latitude_deg, selectedAirportInfo.longitude_deg]">
                    <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
                  </l-map>
                </div>
                <div>
                  <CardInformation :selectedAirport="selectedAirportInfo" />
                </div>
              </div>
              <div v-else class="d-flex justify-content-center align-items-center py-3" style="flex: 1;">
                <img src="@/assets/location.svg" height="30" alt="no selected option info">
                <p class="m-0">No location selected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
      <FooterSection />

  </div>
</template>


<script>

import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import PreLoader from '@/components/PreLoader.vue'
import CardInformation from '@/components/CardInformation.vue'

import airportInfoApi from '@/services/airports.services.js'

import { airports } from '@/data/airports.js'

export default {

  components: {
    FooterSection,
    HeaderSection,
    PreLoader,
    CardInformation,
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

      airports: airports,

      isLoading: false,

    }
  },


  methods: {

    refreshMap() {
      this.mapKey += 1;
    },

    toggleInfoSection() {
      this.showCurrentInfo = !this.showCurrentInfo;
    },

    async handleMarkerClick(icao) {
      this.isLoading = true; // Mostrar preloader

      try {
        const endpoint = `/${icao}?apiToken=${process.env.VUE_APP_AIRPORTDB_API_KEY}`;
        const { data } = await airportInfoApi.get(endpoint);

        const { municipality, name, latitude_deg, longitude_deg, iso_country, iso_region } = data;

        this.selectedAirportInfo = {
          municipality,
          name,
          latitude_deg,
          longitude_deg,
          iso_country,
          iso_region
        };
        this.refreshMap();
      } catch (error) {
        console.error('Error loading airport info:', error);
      } finally {
        this.isLoading = false; // Ocultar preloader
      }
    },


    disableScroll(event) {
      // Previene el evento de desplazamiento cuando el mouse está sobre el mapa
      event.preventDefault();
    },

    resetInfo() {
      this.selectedAirportInfo = {};
      this.zoom = 5
      this.latitude = -9.1900
      this.longitud = -75.0152

      console.log(this.zoom, this.latitude, this.longitud)
    },

    getLocations() {
      // TODO: get all locations
    }
  }
};
</script>

<style scoped>
.map-content {
  background: #b7bac1;
  border-radius: 10px;
  height: 500px;
}

.card-map {
  border: 0px;
  border-radius: 7px;
  height: auto;
  overflow: hidden;
  background: #f5f5dc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);

}

.card-info {
  background: #f5f5dc;
  border-radius: 7px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);

}

.airport-info {
  font-size: small;
  display: flex;
  flex-direction: column;
}

.map-details {
  /* flex: 1; */
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  height: 50%;
}

/* Adaptaciones para móviles y tablets */
@media (max-width: 768px) {

  .card-map,
  .card-info {
    margin-bottom: 20px;
  }

  .map-content {
    height: 500px;
    /* Ajusta la altura para dispositivos móviles */
  }

  .map-details {
    height: 200px;
    /* Ajusta la altura para dispositivos móviles */
  }
}
</style>
