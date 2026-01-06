<template>
    <div class="flights-panel" role="feed" aria-label="Panel de vuelos en tiempo real">
        <!-- Panel Header con indicador en vivo -->
        <div class="panel-header">
            <h5 class="panel-title">
                <i class="bi bi-airplane-engines me-2"></i>
                VUELOS EN VIVO
            </h5>
            <div class="realtime-indicator" v-if="!isLoading && hasApiKey">
                <span class="pulse-dot"></span>
                <span class="live-text">EN VIVO</span>
                <span class="separator">•</span>
                <span class="last-update">{{ lastUpdateFormatted }}</span>
                <button class="refresh-btn" @click="fetchFlights" :disabled="isLoading" title="Actualizar ahora">
                    <i class="bi bi-arrow-clockwise" :class="{ 'spin': isLoading }"></i>
                </button>
            </div>
        </div>

        <!-- Airport Selector Mejorado -->
        <AirportSelector v-model="selectedAirport" @change="handleAirportChange" class="mb-3" />

        <!-- Tabs de Llegadas/Salidas con diferenciación visual -->
        <div class="flight-tabs">
            <button class="tab-btn tab-arrival" :class="{ active: activeTab === 'arrivals' }"
                @click="activeTab = 'arrivals'" :aria-selected="activeTab === 'arrivals'">
                <i class="bi bi-arrow-down-circle-fill"></i>
                <span class="tab-label">Llegadas</span>
                <span class="tab-count">{{ arrivals.length }}</span>
            </button>

            <button class="tab-btn tab-departure" :class="{ active: activeTab === 'departures' }"
                @click="activeTab = 'departures'" :aria-selected="activeTab === 'departures'">
                <i class="bi bi-arrow-up-circle-fill"></i>
                <span class="tab-label">Salidas</span>
                <span class="tab-count">{{ departures.length }}</span>
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="state-container loading-state">
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
            <p class="state-text">Obteniendo vuelos...</p>
            <small class="state-subtext">Conectando con AviationStack</small>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="state-container error-state">
            <div class="state-icon error">
                <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
            <p class="state-text">{{ error }}</p>
            <button class="btn-retry" @click="fetchFlights">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Reintentar
            </button>
        </div>

        <!-- No API Key State -->
        <div v-else-if="!hasApiKey" class="state-container no-api-state">
            <div class="state-icon warning">
                <i class="bi bi-key-fill"></i>
            </div>
            <p class="state-text">API Key no configurada</p>
            <small class="state-subtext">
                Agrega tu API key de AviationStack en el archivo .env
            </small>
            <code class="api-hint">VITE_AVIATIONSTACK_API_KEY=tu_key</code>
            <a href="https://aviationstack.com" target="_blank" rel="noopener noreferrer" class="btn-external">
                <i class="bi bi-box-arrow-up-right me-1"></i>
                Obtener API Key
            </a>
        </div>

        <!-- Empty State con mensaje contextual -->
        <div v-else-if="currentFlights.length === 0" class="state-container empty-state">
            <div class="state-icon empty">
                <i :class="activeTab === 'arrivals' ? 'bi-airplane-arrival' : 'bi-airplane-departure'"></i>
            </div>
            <p class="state-text">
                {{ activeTab === 'arrivals' ? 'Sin llegadas programadas' : 'Sin salidas programadas' }}
            </p>
            <small class="state-subtext">{{ contextualEmptyMessage }}</small>
        </div>

        <!-- Flights List -->
        <div v-else class="flights-list" aria-live="polite">
            <TransitionGroup name="flight-list">
                <FlightCard v-for="(flight, index) in currentFlights"
                    :key="flight.flight?.iata || flight.flight?.icao || index" :flight="flight"
                    :is-departure="activeTab === 'departures'" @click="$emit('select-flight', flight)" />
            </TransitionGroup>
        </div>

        <!-- Auto-refresh countdown -->
        <div class="refresh-timer" v-if="!isLoading && hasApiKey && currentFlights.length > 0">
            <div class="timer-bar">
                <div class="timer-progress" :style="{ width: timerProgress + '%' }"></div>
            </div>
            <small class="timer-text">
                <i class="bi bi-arrow-repeat me-1"></i>
                Próxima actualización en {{ formatCountdown }}
            </small>
        </div>

        <!-- Anuncio para lectores de pantalla -->
        <div class="visually-hidden" aria-live="assertive">
            {{ announceMessage }}
        </div>
    </div>
</template>

<script>
import FlightCard from './FlightCard.vue'
import AirportSelector from './AirportSelector.vue'
import { getArrivals, getDepartures } from '@/services/flights.services'
import { airports } from '@/data/airports'

export default {
    name: 'FlightsList',

    components: {
        FlightCard,
        AirportSelector
    },

    props: {
        defaultAirport: {
            type: String,
            default: 'SPIM' // Lima Jorge Chávez
        }
    },

    emits: ['select-flight', 'flights-loaded'],

    data() {
        return {
            activeTab: 'arrivals',
            selectedAirport: null,
            arrivals: [],
            departures: [],
            isLoading: false,
            error: null,
            lastUpdate: null,
            refreshInterval: null,
            refreshCountdown: 300, // 5 minutes
            countdownInterval: null,
            announceMessage: ''
        }
    },

    computed: {
        hasApiKey() {
            return !!import.meta.env.VITE_AVIATIONSTACK_API_KEY
        },

        currentFlights() {
            return this.activeTab === 'arrivals' ? this.arrivals : this.departures
        },

        lastUpdateFormatted() {
            if (!this.lastUpdate) return ''
            return this.lastUpdate.toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit'
            })
        },

        formatCountdown() {
            const minutes = Math.floor(this.refreshCountdown / 60)
            const seconds = this.refreshCountdown % 60
            return `${minutes}:${seconds.toString().padStart(2, '0')}`
        },

        timerProgress() {
            return (this.refreshCountdown / 300) * 100
        },

        contextualEmptyMessage() {
            const hour = new Date().getHours()

            if (hour >= 0 && hour < 6) {
                return 'Es horario nocturno. Los vuelos suelen operar entre 6:00 AM y 11:00 PM.'
            }

            const selectedAirportData = airports.find(a => a.icao === this.selectedAirport)
            const airportName = selectedAirportData?.airport_name?.split(' ')[0] || 'este aeropuerto'

            return `No hay ${this.activeTab === 'arrivals' ? 'llegadas' : 'salidas'} registradas para ${airportName} en este momento.`
        }
    },

    watch: {
        selectedAirport(newVal) {
            if (newVal) {
                this.fetchFlights()
            }
        }
    },

    mounted() {
        this.selectedAirport = this.defaultAirport
        this.startAutoRefresh()
    },

    beforeUnmount() {
        this.stopAutoRefresh()
    },

    methods: {
        handleAirportChange(icao) {
            // El v-model ya actualiza selectedAirport, esto es para lógica adicional si se necesita
            console.log('Airport changed to:', icao)
        },

        async fetchFlights() {
            if (!this.selectedAirport || !this.hasApiKey) return

            this.isLoading = true
            this.error = null

            try {
                const [arrivalsData, departuresData] = await Promise.all([
                    getArrivals(this.selectedAirport),
                    getDepartures(this.selectedAirport)
                ])

                const prevArrivalsCount = this.arrivals.length
                const prevDeparturesCount = this.departures.length

                this.arrivals = arrivalsData
                this.departures = departuresData
                this.lastUpdate = new Date()

                // Anunciar cambios para accesibilidad
                if (prevArrivalsCount !== arrivalsData.length || prevDeparturesCount !== departuresData.length) {
                    this.announceMessage = `Datos actualizados. ${arrivalsData.length} llegadas y ${departuresData.length} salidas.`
                }

                // Emit flights for map visualization
                this.$emit('flights-loaded', {
                    arrivals: this.arrivals,
                    departures: this.departures,
                    airport: this.selectedAirport
                })

                // Reset countdown
                this.refreshCountdown = 300
            } catch (err) {
                console.error('Error fetching flights:', err)
                this.error = err.response?.data?.error?.message || 'Error al obtener vuelos. Intenta de nuevo.'
            } finally {
                this.isLoading = false
            }
        },

        startAutoRefresh() {
            // Refresh every 5 minutes
            this.refreshInterval = setInterval(() => {
                this.fetchFlights()
            }, 300000)

            // Countdown timer
            this.countdownInterval = setInterval(() => {
                if (this.refreshCountdown > 0) {
                    this.refreshCountdown--
                }
            }, 1000)
        },

        stopAutoRefresh() {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval)
            }
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval)
            }
        }
    }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   PANEL PRINCIPAL
   ═══════════════════════════════════════════════════════════ */

.flights-panel {
    background: linear-gradient(180deg,
            var(--color-bg-primary, #0f0f23) 0%,
            var(--color-bg-secondary, #1a1a2e) 100%);
    border-radius: var(--radius-lg, 12px);
    padding: var(--spacing-lg, 16px);
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    color: var(--color-text-secondary, #e0e0e0);
    overflow: hidden;
}

/* ═══════════════════════════════════════════════════════════
   HEADER DEL PANEL
   ═══════════════════════════════════════════════════════════ */

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg, 16px);
    padding-bottom: var(--spacing-md, 12px);
    border-bottom: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
    flex-wrap: wrap;
    gap: var(--spacing-sm, 8px);
}

.panel-title {
    color: var(--color-text-primary, #fff);
    font-weight: var(--font-weight-semibold, 600);
    font-size: var(--font-size-md, 1rem);
    margin: 0;
    display: flex;
    align-items: center;
}

/* ═══════════════════════════════════════════════════════════
   INDICADOR EN TIEMPO REAL
   ═══════════════════════════════════════════════════════════ */

.realtime-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 8px);
    padding: 6px 12px;
    background: var(--status-active-bg, rgba(39, 174, 96, 0.1));
    border-radius: var(--radius-full, 30px);
    font-size: var(--font-size-sm, 0.8rem);
}

.pulse-dot {
    width: 8px;
    height: 8px;
    background: var(--status-active, #27ae60);
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7);
    }

    50% {
        transform: scale(1.1);
        opacity: 0.8;
        box-shadow: 0 0 0 6px rgba(39, 174, 96, 0);
    }
}

.live-text {
    color: var(--status-active, #27ae60);
    font-weight: var(--font-weight-bold, 700);
    letter-spacing: 0.5px;
}

.separator {
    color: var(--color-text-muted, #666);
}

.last-update {
    color: var(--color-text-muted, #888);
}

.refresh-btn {
    background: none;
    border: none;
    color: var(--color-text-muted, #888);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm, 6px);
    transition: all var(--transition-fast, 0.15s ease);
}

.refresh-btn:hover {
    color: var(--color-text-primary, #fff);
    background: rgba(255, 255, 255, 0.1);
}

.refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.refresh-btn .spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* ═══════════════════════════════════════════════════════════
   TABS DE LLEGADAS / SALIDAS
   ═══════════════════════════════════════════════════════════ */

.flight-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md, 12px);
    margin-bottom: var(--spacing-lg, 16px);
}

.tab-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm, 8px);
    padding: 14px 20px;
    border-radius: var(--radius-lg, 12px);
    border: 2px solid transparent;
    font-weight: var(--font-weight-semibold, 600);
    font-size: var(--font-size-base, 0.9rem);
    cursor: pointer;
    transition: all var(--transition-normal, 0.2s ease);
}

/* Tab Llegadas */
.tab-arrival {
    background: var(--type-arrival-bg, rgba(52, 152, 219, 0.1));
    color: var(--type-arrival, #3498db);
    border-color: var(--type-arrival-border, rgba(52, 152, 219, 0.3));
}

.tab-arrival:hover {
    background: rgba(52, 152, 219, 0.2);
    transform: translateY(-2px);
}

.tab-arrival.active {
    background: var(--type-arrival-gradient, linear-gradient(135deg, #3498db 0%, #2980b9 100%));
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

/* Tab Salidas */
.tab-departure {
    background: var(--type-departure-bg, rgba(230, 126, 34, 0.1));
    color: var(--type-departure, #e67e22);
    border-color: var(--type-departure-border, rgba(230, 126, 34, 0.3));
}

.tab-departure:hover {
    background: rgba(230, 126, 34, 0.2);
    transform: translateY(-2px);
}

.tab-departure.active {
    background: var(--type-departure-gradient, linear-gradient(135deg, #e67e22 0%, #d35400 100%));
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(230, 126, 34, 0.4);
}

.tab-label {
    font-weight: var(--font-weight-semibold, 600);
}

.tab-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 10px;
    border-radius: var(--radius-full, 20px);
    font-size: var(--font-size-sm, 0.85rem);
    font-weight: var(--font-weight-bold, 700);
}

/* ═══════════════════════════════════════════════════════════
   ESTADOS (LOADING, ERROR, EMPTY)
   ═══════════════════════════════════════════════════════════ */

.state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    flex: 1;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    margin-bottom: var(--spacing-lg, 16px);
}

.spinner {
    width: 100%;
    height: 100%;
    border: 3px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
    border-top-color: var(--type-arrival, #3498db);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.state-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin-bottom: var(--spacing-lg, 16px);
}

.state-icon.error {
    background: var(--status-delayed-bg, rgba(243, 156, 18, 0.15));
    color: var(--status-delayed, #f39c12);
}

.state-icon.warning {
    background: var(--status-delayed-bg, rgba(243, 156, 18, 0.15));
    color: var(--status-delayed, #f39c12);
}

.state-icon.empty {
    background: var(--color-bg-card, rgba(255, 255, 255, 0.05));
    color: var(--color-text-muted, #888);
}

.state-text {
    color: var(--color-text-primary, #fff);
    font-weight: var(--font-weight-medium, 500);
    margin-bottom: var(--spacing-sm, 8px);
}

.state-subtext {
    color: var(--color-text-muted, #888);
    font-size: var(--font-size-sm, 0.85rem);
    max-width: 280px;
    margin-bottom: var(--spacing-md, 12px);
}

.api-hint {
    background: rgba(255, 255, 255, 0.1);
    padding: var(--spacing-sm, 8px) var(--spacing-md, 12px);
    border-radius: var(--radius-md, 8px);
    font-size: var(--font-size-xs, 0.75rem);
    font-family: var(--font-family-mono, monospace);
    margin-bottom: var(--spacing-md, 12px);
    display: block;
}

.btn-retry,
.btn-external {
    display: inline-flex;
    align-items: center;
    padding: var(--spacing-sm, 8px) var(--spacing-lg, 16px);
    border-radius: var(--radius-md, 8px);
    font-size: var(--font-size-sm, 0.85rem);
    font-weight: var(--font-weight-medium, 500);
    cursor: pointer;
    transition: all var(--transition-fast, 0.15s ease);
    text-decoration: none;
}

.btn-retry {
    background: transparent;
    border: 1px solid var(--type-arrival, #3498db);
    color: var(--type-arrival, #3498db);
}

.btn-retry:hover {
    background: var(--type-arrival, #3498db);
    color: white;
}

.btn-external {
    background: var(--type-arrival-bg, rgba(52, 152, 219, 0.1));
    border: 1px solid var(--type-arrival-border, rgba(52, 152, 219, 0.3));
    color: var(--type-arrival, #3498db);
}

.btn-external:hover {
    background: var(--type-arrival, #3498db);
    color: white;
}

/* ═══════════════════════════════════════════════════════════
   LISTA DE VUELOS
   ═══════════════════════════════════════════════════════════ */

.flights-list {
    flex: 1;
    min-height: 0;
    /* Crucial para scroll en flexbox */
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
    margin-right: -4px;
}

.flights-list::-webkit-scrollbar {
    width: 6px;
}

.flights-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
}

.flights-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.flights-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Animaciones de lista */
.flight-list-enter-active,
.flight-list-leave-active {
    transition: all 0.3s ease;
}

.flight-list-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.flight-list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.flight-list-move {
    transition: transform 0.3s ease;
}

/* ═══════════════════════════════════════════════════════════
   TIMER DE ACTUALIZACIÓN
   ═══════════════════════════════════════════════════════════ */

.refresh-timer {
    margin-top: var(--spacing-md, 12px);
    padding-top: var(--spacing-md, 12px);
    border-top: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
}

.timer-bar {
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: var(--spacing-sm, 8px);
}

.timer-progress {
    height: 100%;
    background: linear-gradient(90deg,
            var(--type-arrival, #3498db) 0%,
            var(--status-active, #27ae60) 100%);
    border-radius: 2px;
    transition: width 1s linear;
}

.timer-text {
    display: block;
    text-align: center;
    color: var(--color-text-muted, #888);
    font-size: var(--font-size-xs, 0.75rem);
}

/* ═══════════════════════════════════════════════════════════
   ACCESIBILIDAD
   ═══════════════════════════════════════════════════════════ */

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 576px) {
    .flights-panel {
        padding: var(--spacing-md, 12px);
    }

    .panel-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .realtime-indicator {
        width: 100%;
        justify-content: center;
    }

    .flight-tabs {
        gap: var(--spacing-sm, 8px);
    }

    .tab-btn {
        padding: 10px 12px;
        font-size: var(--font-size-sm, 0.85rem);
    }

    .tab-btn i {
        display: none;
    }
}

/* ═══════════════════════════════════════════════════════════
   MODO KIOSKO
   ═══════════════════════════════════════════════════════════ */

@media (min-width: 1400px) {
    .flights-panel {
        padding: var(--spacing-xl, 20px) var(--spacing-2xl, 24px);
    }

    .panel-title {
        font-size: var(--font-size-lg, 1.25rem);
    }

    .tab-btn {
        padding: 18px 28px;
        font-size: var(--font-size-md, 1rem);
    }
}
</style>
