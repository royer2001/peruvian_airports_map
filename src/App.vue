<template>
  <BOrchestrator />
  <AirportsMap />
</template>

<script>
import { BOrchestrator } from 'bootstrap-vue-next'
import AirportsMap from './components/AirportsMap.vue'

export default {
  name: 'App',
  components: {
    BOrchestrator,
    AirportsMap
  }
}
</script>

<style>
/* Global Styles for Dashboard Theme */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0a0a1a;
  color: #e0e0e0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Override Bootstrap defaults for dark theme */
.card {
  background: transparent;
  border: none;
}

/* Leaflet popup styling */
.leaflet-popup-content-wrapper {
  background: #1a1a2e;
  color: #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.leaflet-popup-tip {
  background: #1a1a2e;
}

.leaflet-popup-content {
  margin: 10px 14px;
}

/* Custom scrollbar for entire page */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a1a;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
