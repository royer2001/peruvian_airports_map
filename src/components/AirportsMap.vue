<template>
  <div class="dashboard">
    <PreLoader :isLoading="isLoading" />

    <!-- Dashboard Header -->
    <header class="dashboard-header">
      <div class="header-left">
        <img src="@/assets/peru_flag.svg" class="header-flag" alt="Peru Flag">
        <div class="header-title">
          <h1>Peru Flight Tracker</h1>
          <span class="header-subtitle">Sistema de Monitoreo de Vuelos en Tiempo Real</span>
        </div>
      </div>
      <div class="header-right">
        <div class="current-time">
          <i class="bi bi-clock"></i>
          <span>{{ currentTime }}</span>
        </div>
        <div class="header-stats">
          <div class="stat-badge arrivals">
            <i class="bi bi-arrow-down-circle-fill"></i>
            <span>{{ currentArrivals.length }}</span>
            <small>Llegadas</small>
          </div>
          <div class="stat-badge departures">
            <i class="bi bi-arrow-up-circle-fill"></i>
            <span>{{ currentDepartures.length }}</span>
            <small>Salidas</small>
          </div>
          <div class="stat-badge active" v-if="activeFlights.length > 0">
            <i class="bi bi-airplane-fill"></i>
            <span>{{ activeFlights.length }}</span>
            <small>En vuelo</small>
          </div>
        </div>
      </div>
    </header>

    <!-- Dashboard Main Content -->
    <main class="dashboard-main">
      <!-- Left Sidebar - Airport Info -->
      <aside class="dashboard-sidebar">
        <div class="sidebar-section">
          <h6 class="section-title">
            <i class="bi bi-geo-alt-fill"></i>
            Aeropuerto Seleccionado
          </h6>

          <div class="selected-airport-card" v-if="selectedAirportInfo">
            <div class="airport-mini-map">
              <l-map style="height: 100%; width: 100%" :key="mapKey" :options="{ ...mapOptions, zoomControl: false }"
                :zoom="13" :center="[selectedAirportInfo.latitude_deg, selectedAirportInfo.longitude_deg]">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
              </l-map>
            </div>
            <div class="airport-details">
              <h5 class="airport-name">{{ selectedAirportInfo.name }}</h5>
              <div class="airport-meta">
                <span><i class="bi bi-pin-map"></i> {{ selectedAirportInfo.municipality }}</span>
                <span><i class="bi bi-flag"></i> {{ selectedAirportInfo.iso_region }}</span>
              </div>
              <div class="airport-coords">
                <span>{{ selectedAirportInfo.latitude_deg?.toFixed(4) }}°</span>
                <span>{{ selectedAirportInfo.longitude_deg?.toFixed(4) }}°</span>
              </div>
              <button class="btn-details" @click="openAirportModal">
                <i class="bi bi-info-circle-fill me-2"></i>
                Ver más detalles
              </button>
            </div>
          </div>

          <div class="empty-selection" v-else>
            <i class="bi bi-cursor-fill"></i>
            <p>Haz clic en un aeropuerto del mapa para ver sus detalles</p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="sidebar-section">
          <h6 class="section-title">
            <i class="bi bi-bar-chart-fill"></i>
            Estadísticas
          </h6>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ airports.length }}</span>
              <span class="stat-label">Aeropuertos</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalFlights }}</span>
              <span class="stat-label">Total Vuelos</span>
            </div>
            <div class="stat-item on-time">
              <span class="stat-value">{{ onTimeFlights }}</span>
              <span class="stat-label">A Tiempo</span>
            </div>
            <div class="stat-item delayed">
              <span class="stat-value">{{ delayedFlights }}</span>
              <span class="stat-label">Retrasados</span>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="sidebar-section">
          <h6 class="section-title">
            <i class="bi bi-info-circle-fill"></i>
            Leyenda del Mapa
          </h6>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-dot airport"></span>
              <span>Aeropuertos</span>
            </div>
            <div class="legend-item">
              <span class="legend-line arrival"></span>
              <span>Rutas de llegada</span>
            </div>
            <div class="legend-item">
              <span class="legend-line departure"></span>
              <span>Rutas de salida</span>
            </div>
            <div class="legend-item" v-if="activeFlights.length > 0">
              <span class="legend-dot plane"></span>
              <span>Vuelos en aire</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Center - Main Map -->
      <section class="dashboard-map">
        <div class="map-container">
          <div class="map-header">
            <h5>
              <i class="bi bi-map"></i>
              Mapa de Aeropuertos del Perú
            </h5>
            <div class="map-controls">
              <button class="control-btn" @click="resetView" title="Restablecer vista">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
              <button class="control-btn" @click="toggleFullscreen" title="Pantalla completa">
                <i class="bi bi-fullscreen"></i>
              </button>
            </div>
          </div>
          <div class="map-wrapper" ref="mapWrapper">
            <l-map ref="mainMap" :options="mapOptions" :zoom="zoom" :center="[latitude, longitud]" class="main-map">
              <l-tile-layer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap, &copy; CARTO"></l-tile-layer>

              <!-- Airport Markers -->
              <l-marker v-for="({ latitude, longitud, airport_name, icao }, index) in airports"
                :key="'airport-' + index" :lat-lng="[parseFloat(latitude), parseFloat(longitud)]"
                @click="handleMarkerClick(icao)">
                <l-popup>
                  <div class="airport-popup">
                    <strong>{{ airport_name }}</strong>
                    <span class="popup-code">{{ icao }}</span>
                  </div>
                </l-popup>
              </l-marker>

              <!-- Flight Routes (Polylines) -->
              <l-polyline v-for="(route, index) in flightRoutes" :key="'route-' + index" :lat-lngs="route.path"
                :color="route.color" :weight="2" :opacity="0.7" :dash-array="route.isDeparture ? '8, 8' : null" />

              <!-- Active Flight Markers (planes in air) -->
              <l-marker v-for="(flight, index) in activeFlights" :key="'flight-' + index"
                :lat-lng="[flight.live.latitude, flight.live.longitude]" :icon="planeIcon">
                <l-popup>
                  <div class="flight-popup">
                    <strong>{{ flight.flight?.iata || 'N/A' }}</strong>
                    <span>{{ flight.airline?.name }}</span>
                    <span class="popup-data">Alt: {{ Math.round(flight.live.altitude) }}m</span>
                  </div>
                </l-popup>
              </l-marker>
            </l-map>
          </div>
        </div>
      </section>

      <!-- Right Panel - Flights List -->
      <aside class="dashboard-flights">
        <FlightsList :default-airport="selectedAirportIcao || 'SPIM'" @flights-loaded="handleFlightsLoaded"
          @select-flight="handleFlightSelect" />
      </aside>
    </main>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <span>© 2026 Peru Flight Tracker</span>
      <span class="footer-separator">|</span>
      <span>Datos proporcionados por AviationStack</span>
    </footer>

    <!-- Airport Details Modal -->
    <AirportModal :show="showAirportModal" :airport="{ ...selectedAirportInfo, icao: selectedAirportIcao }"
      :flight-stats="airportFlightStats" @close="closeAirportModal" />
  </div>
</template>


<script>
import PreLoader from '@/components/PreLoader.vue'
import FlightsList from '@/components/FlightsList.vue'
import AirportModal from '@/components/AirportModal.vue'
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LPolyline,
} from "@vue-leaflet/vue-leaflet";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

// Custom plane icon
const planeIcon = L.divIcon({
  html: '<i class="bi bi-airplane-fill" style="font-size: 18px; color: #27ae60; transform: rotate(45deg); filter: drop-shadow(0 0 4px rgba(39,174,96,0.6));"></i>',
  className: 'plane-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

import airportInfoApi from '@/services/airports.services.js'
import { airports } from '@/data/airports.js'

export default {
  name: 'AirportsDashboard',

  components: {
    PreLoader,
    FlightsList,
    AirportModal,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
  },

  data() {
    return {
      mapKey: 0,
      planeIcon,

      zoom: 5,
      latitude: -9.1900,
      longitud: -75.0152,

      selectedLatitude: null,
      selectedLongitud: null,
      selectedAirportIcao: null,

      mapOptions: {
        dragging: true,
        zoomControl: true,
        scrollWheelZoom: true,
      },

      selectedAirportInfo: null,
      airports: airports,
      isLoading: false,

      // Flight data
      currentArrivals: [],
      currentDepartures: [],

      // Known airport coordinates
      knownAirports: {},

      // Time
      currentTime: '',
      timeInterval: null,

      // Modal
      showAirportModal: false
    }
  },

  computed: {
    activeFlights() {
      return [...this.currentArrivals, ...this.currentDepartures]
        .filter(f => f.live && f.live.latitude && f.live.longitude);
    },

    flightRoutes() {
      const routes = [];
      const selectedAirportCoords = this.getAirportCoords(this.selectedAirportIcao || 'SPIM');

      if (!selectedAirportCoords) return routes;

      // Arrivals
      this.currentArrivals.forEach(flight => {
        if (flight.departure?.icao) {
          const depCoords = this.getAirportCoords(flight.departure.icao);
          if (depCoords) {
            routes.push({
              path: [depCoords, selectedAirportCoords],
              color: '#3498db',
              isDeparture: false
            });
          }
        }
      });

      // Departures
      this.currentDepartures.forEach(flight => {
        if (flight.arrival?.icao) {
          const arrCoords = this.getAirportCoords(flight.arrival.icao);
          if (arrCoords) {
            routes.push({
              path: [selectedAirportCoords, arrCoords],
              color: '#e67e22',
              isDeparture: true
            });
          }
        }
      });

      return routes;
    },

    totalFlights() {
      return this.currentArrivals.length + this.currentDepartures.length;
    },

    onTimeFlights() {
      const allFlights = [...this.currentArrivals, ...this.currentDepartures];
      return allFlights.filter(f =>
        f.flight_status === 'scheduled' ||
        f.flight_status === 'active' ||
        f.flight_status === 'landed'
      ).length;
    },

    delayedFlights() {
      const allFlights = [...this.currentArrivals, ...this.currentDepartures];
      return allFlights.filter(f =>
        (f.departure?.delay && f.departure.delay > 0) ||
        (f.arrival?.delay && f.arrival.delay > 0)
      ).length;
    },

    airportFlightStats() {
      return {
        arrivals: this.currentArrivals.length,
        departures: this.currentDepartures.length,
        active: this.activeFlights.length
      };
    }
  },

  mounted() {
    // Build airport coords lookup
    this.airports.forEach(airport => {
      this.knownAirports[airport.icao] = [parseFloat(airport.latitude), parseFloat(airport.longitud)];
    });

    // Update time
    this.updateTime();
    this.timeInterval = setInterval(this.updateTime, 1000);
  },

  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },

  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },

    refreshMap() {
      this.mapKey += 1;
    },

    getAirportCoords(icao) {
      return this.knownAirports[icao] || null;
    },

    async handleMarkerClick(icao) {
      this.isLoading = true;
      this.selectedAirportIcao = icao;

      try {
        const endpoint = `/${icao}?apiToken=${import.meta.env.VITE_AIRPORT_DB_API_KEY}`;
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
        this.isLoading = false;
      }
    },

    handleFlightsLoaded({ arrivals, departures }) {
      this.currentArrivals = arrivals;
      this.currentDepartures = departures;
    },

    handleFlightSelect(flight) {
      if (flight.live && flight.live.latitude && flight.live.longitude) {
        this.latitude = flight.live.latitude;
        this.longitud = flight.live.longitude;
        this.zoom = 7;
      }
    },

    resetView() {
      this.zoom = 5;
      this.latitude = -9.1900;
      this.longitud = -75.0152;
    },

    toggleFullscreen() {
      const mapWrapper = this.$refs.mapWrapper;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapWrapper?.requestFullscreen();
      }
    },

    openAirportModal() {
      if (this.selectedAirportInfo) {
        this.showAirportModal = true;
      }
    },

    closeAirportModal() {
      this.showAirportModal = false;
    }
  }
};
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   DASHBOARD LAYOUT
   ═══════════════════════════════════════════════════════════ */

.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-primary, #0a0a1a);
  color: var(--color-text-secondary, #e0e0e0);
  font-family: var(--font-family-base, 'Inter', sans-serif);
}

/* ═══════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════ */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  /* Altura fija para el navbar */
  padding: 0 24px;
  background-image:
    linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.85) 100%),
    url('@/assets/bg_header.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-bottom: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
  gap: 16px;
  position: relative;
  overflow: hidden;
  /* Asegura que nada sobresalga */
  flex-shrink: 0;
  /* Evita que se contraiga en el layout flex */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-flag {
  width: 40px;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary, #fff);
  background: linear-gradient(90deg, #fff 0%, #3498db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted, #888);
  display: block;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.current-time {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-family: var(--font-family-mono, monospace);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary, #fff);
}

.header-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
}

.stat-badge i {
  font-size: 1.1rem;
}

.stat-badge span {
  font-size: 1.2rem;
  font-family: var(--font-family-mono, monospace);
}

.stat-badge small {
  font-size: 0.7rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-badge.arrivals {
  background: var(--type-arrival-bg, rgba(52, 152, 219, 0.15));
  color: var(--type-arrival, #3498db);
}

.stat-badge.departures {
  background: var(--type-departure-bg, rgba(230, 126, 34, 0.15));
  color: var(--type-departure, #e67e22);
}

.stat-badge.active {
  background: var(--status-active-bg, rgba(39, 174, 96, 0.15));
  color: var(--status-active, #27ae60);
}

/* ═══════════════════════════════════════════════════════════
   MAIN CONTENT - 3 COLUMN LAYOUT
   ═══════════════════════════════════════════════════════════ */

.dashboard-main {
  display: grid;
  grid-template-columns: 280px 1fr 380px;
  gap: 20px;
  padding: 20px;
  flex: 1;
  overflow: hidden;
}

/* ═══════════════════════════════════════════════════════════
   LEFT SIDEBAR
   ═══════════════════════════════════════════════════════════ */

.dashboard-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.sidebar-section {
  background: var(--color-bg-secondary, #1a1a2e);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary, #fff);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title i {
  color: var(--type-arrival, #3498db);
}

/* Selected Airport Card */
.selected-airport-card {
  background: var(--color-bg-card, rgba(255, 255, 255, 0.03));
  border-radius: 10px;
  overflow: hidden;
}

.airport-mini-map {
  height: 120px;
  background: var(--color-bg-tertiary, #16213e);
}

.airport-details {
  padding: 12px;
}

.airport-name {
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary, #fff);
  line-height: 1.3;
}

.airport-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--color-text-muted, #888);
}

.airport-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.airport-coords {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
  font-family: var(--font-family-mono, monospace);
  font-size: 0.75rem;
  color: var(--color-text-muted, #666);
}

.btn-details {
  width: 100%;
  margin-top: 12px;
  padding: 10px 16px;
  background: var(--type-arrival-gradient, linear-gradient(135deg, #3498db 0%, #2980b9 100%));
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.btn-details:active {
  transform: translateY(0);
}

.empty-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  text-align: center;
  color: var(--color-text-muted, #888);
}

.empty-selection i {
  font-size: 2rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-selection p {
  margin: 0;
  font-size: 0.85rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-item {
  background: var(--color-bg-card, rgba(255, 255, 255, 0.03));
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-family-mono, monospace);
  color: var(--color-text-primary, #fff);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-text-muted, #888);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-item.on-time .stat-value {
  color: var(--status-active, #27ae60);
}

.stat-item.delayed .stat-value {
  color: var(--status-delayed, #f39c12);
}

/* Legend */
.legend-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--color-text-secondary, #e0e0e0);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.airport {
  background: #3498db;
}

.legend-dot.plane {
  background: #27ae60;
  animation: pulse 2s infinite;
}

.legend-line {
  width: 24px;
  height: 3px;
  border-radius: 2px;
}

.legend-line.arrival {
  background: #3498db;
}

.legend-line.departure {
  background: #e67e22;
  background-image: repeating-linear-gradient(90deg,
      #e67e22,
      #e67e22 4px,
      transparent 4px,
      transparent 8px);
}

/* ═══════════════════════════════════════════════════════════
   CENTER - MAP
   ═══════════════════════════════════════════════════════════ */

.dashboard-map {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-container {
  flex: 1;
  background: var(--color-bg-secondary, #1a1a2e);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
}

.map-header h5 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary, #e0e0e0);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary, #fff);
}

.map-wrapper {
  flex: 1;
  position: relative;
}

.main-map {
  height: 100%;
  width: 100%;
}

/* ═══════════════════════════════════════════════════════════
   RIGHT PANEL - FLIGHTS
   ═══════════════════════════════════════════════════════════ */

.dashboard-flights {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* Crucial para scroll en CSS Grid */
}

.dashboard-flights>* {
  flex: 1;
  height: 100%;
  min-height: 0;
  /* Permite que el hijo tenga scroll */
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */

.dashboard-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-bg-secondary, #1a1a2e);
  border-top: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
  font-size: 0.75rem;
  color: var(--color-text-muted, #888);
}

.footer-separator {
  opacity: 0.5;
}

/* ═══════════════════════════════════════════════════════════
   POPUPS
   ═══════════════════════════════════════════════════════════ */

.airport-popup,
.flight-popup {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.popup-code {
  font-family: var(--font-family-mono, monospace);
  font-size: 0.8rem;
  color: #3498db;
}

.popup-data {
  font-size: 0.75rem;
  color: #888;
}

/* ═══════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════ */

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

/* Plane icon styles */
:deep(.plane-icon) {
  background: transparent;
  border: none;
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE - TABLETS
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 1200px) {
  .dashboard-main {
    grid-template-columns: 1fr 350px;
  }

  .dashboard-sidebar {
    display: none;
  }
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE - MOBILE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .dashboard-header {
    height: auto;
    min-height: 60px;
    padding: 12px 16px;
  }

  .header-title h1 {
    font-size: 1.1rem;
  }

  .header-subtitle {
    display: none;
  }

  .header-stats {
    display: none;
  }

  .current-time {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .dashboard-main {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 1fr;
    padding: 12px;
    gap: 12px;
  }

  .dashboard-sidebar {
    display: none;
  }

  .dashboard-flights {
    min-height: 400px;
  }

  .stat-badge span {
    font-size: 1rem;
  }

  .stat-badge small {
    display: none;
  }
}

/* ═══════════════════════════════════════════════════════════
   SCROLLBAR
   ═══════════════════════════════════════════════════════════ */

.dashboard-sidebar::-webkit-scrollbar {
  width: 6px;
}

.dashboard-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.dashboard-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.dashboard-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
