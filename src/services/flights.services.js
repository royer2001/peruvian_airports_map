import axios from 'axios'

const AVIATIONSTACK_BASE_URL = 'http://api.aviationstack.com/v1'

/**
 * Service for fetching real-time flight data from AviationStack API
 */
const flightsApi = axios.create({
  baseURL: AVIATIONSTACK_BASE_URL,
  params: {
    access_key: import.meta.env.VITE_AVIATIONSTACK_API_KEY
  }
})

/**
 * Get flights arriving at a specific airport
 * @param {string} icaoCode - ICAO code of the airport (e.g., 'SPIM' for Lima)
 * @returns {Promise<Array>} - Array of arrival flights
 */
export const getArrivals = async (icaoCode) => {
  try {
    const { data } = await flightsApi.get('/flights', {
      params: {
        arr_icao: icaoCode
      }
    })
    return data.data || []
  } catch (error) {
    console.error('Error fetching arrivals:', error)
    throw error
  }
}

/**
 * Get flights departing from a specific airport
 * @param {string} icaoCode - ICAO code of the airport (e.g., 'SPIM' for Lima)
 * @returns {Promise<Array>} - Array of departure flights
 */
export const getDepartures = async (icaoCode) => {
  try {
    const { data } = await flightsApi.get('/flights', {
      params: {
        dep_icao: icaoCode
      }
    })
    return data.data || []
  } catch (error) {
    console.error('Error fetching departures:', error)
    throw error
  }
}

/**
 * Get all flights for a specific airport (both arrivals and departures)
 * @param {string} icaoCode - ICAO code of the airport
 * @returns {Promise<{arrivals: Array, departures: Array}>}
 */
export const getAirportFlights = async (icaoCode) => {
  const [arrivals, departures] = await Promise.all([
    getArrivals(icaoCode),
    getDepartures(icaoCode)
  ])
  return { arrivals, departures }
}

/**
 * Get flights for all major Peruvian airports
 * @param {Array} airportCodes - Array of ICAO codes
 * @returns {Promise<Array>} - Combined array of all flights
 */
export const getAllPeruFlights = async (airportCodes = ['SPIM']) => {
  try {
    const promises = airportCodes.map(code => getAirportFlights(code))
    const results = await Promise.all(promises)
    
    const allArrivals = results.flatMap(r => r.arrivals)
    const allDepartures = results.flatMap(r => r.departures)
    
    return { 
      arrivals: allArrivals, 
      departures: allDepartures 
    }
  } catch (error) {
    console.error('Error fetching Peru flights:', error)
    throw error
  }
}

/**
 * Format flight status for display
 * @param {string} status - Raw status from API
 * @returns {Object} - Formatted status with color, label, and icon
 */
export const formatFlightStatus = (status) => {
  const statusMap = {
    scheduled: { 
      label: 'Programado', 
      color: 'primary', 
      icon: 'bi-clock',
      cssClass: 'status-scheduled'
    },
    active: { 
      label: 'En vuelo', 
      color: 'success', 
      icon: 'bi-airplane',
      cssClass: 'status-active'
    },
    landed: { 
      label: 'Aterrizado', 
      color: 'success', 
      icon: 'bi-check-circle-fill',
      cssClass: 'status-landed'
    },
    cancelled: { 
      label: 'Cancelado', 
      color: 'danger', 
      icon: 'bi-x-circle-fill',
      cssClass: 'status-cancelled'
    },
    incident: { 
      label: 'Incidente', 
      color: 'warning', 
      icon: 'bi-exclamation-triangle-fill',
      cssClass: 'status-incident'
    },
    diverted: { 
      label: 'Desviado', 
      color: 'warning', 
      icon: 'bi-arrow-repeat',
      cssClass: 'status-diverted'
    },
    delayed: {
      label: 'Retrasado',
      color: 'warning',
      icon: 'bi-clock-history',
      cssClass: 'status-delayed'
    }
  }
  return statusMap[status] || { 
    label: status || 'Desconocido', 
    color: 'secondary', 
    icon: 'bi-question-circle',
    cssClass: 'status-unknown'
  }
}

/**
 * Format time for display
 * @param {string} isoString - ISO date string
 * @returns {string} - Formatted time (HH:MM)
 */
export const formatTime = (isoString) => {
  if (!isoString) return '--:--'
  const date = new Date(isoString)
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

export default {
  getArrivals,
  getDepartures,
  getAirportFlights,
  getAllPeruFlights,
  formatFlightStatus,
  formatTime
}
