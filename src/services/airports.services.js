import axios from 'axios'

const airportInfoApi = axios.create({
    baseURL: 'https://airportdb.io/api/v1/airport'
})

export default airportInfoApi

// /{ICAO}?apiToken={apiToken}