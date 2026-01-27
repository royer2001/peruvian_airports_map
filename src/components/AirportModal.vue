<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="show" class="modal-overlay" @click.self="closeModal">
                <div class="modal-container">
                    <!-- Modal Header -->
                    <div class="modal-header">
                        <div class="header-content">
                            <div class="airport-badge">
                                <i class="bi bi-geo-alt-fill"></i>
                                <span class="badge-code">{{ airport?.icao || 'N/A' }}</span>
                            </div>
                            <h2 class="modal-title">{{ airport?.name || 'Aeropuerto' }}</h2>
                        </div>
                        <button class="close-btn" @click="closeModal" aria-label="Cerrar">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="modal-body">
                        <!-- Location Section -->
                        <div class="info-section">
                            <h6 class="section-title">
                                <i class="bi bi-pin-map-fill"></i>
                                Ubicación
                            </h6>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Ciudad</span>
                                    <span class="info-value">{{ airport?.municipality || 'No disponible' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Región</span>
                                    <span class="info-value">{{ formatRegion(airport?.iso_region) }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">País</span>
                                    <span class="info-value">
                                        <img src="@/assets/peru_flag.svg" class="country-flag" alt="Peru">
                                        {{ airport?.iso_country || 'PE' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Coordinates Section -->
                        <div class="info-section">
                            <h6 class="section-title">
                                <i class="bi bi-compass-fill"></i>
                                Coordenadas
                            </h6>
                            <div class="coords-display">
                                <div class="coord-item">
                                    <span class="coord-label">Latitud</span>
                                    <span class="coord-value">{{ formatCoord(airport?.latitude_deg, 'N', 'S') }}</span>
                                </div>
                                <div class="coord-item">
                                    <span class="coord-label">Longitud</span>
                                    <span class="coord-value">{{ formatCoord(airport?.longitude_deg, 'E', 'W') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Map Preview -->
                        <div class="info-section map-section">
                            <h6 class="section-title">
                                <i class="bi bi-map-fill"></i>
                                Vista del Mapa
                            </h6>
                            <div class="map-preview">
                                <l-map v-if="airport?.latitude_deg && airport?.longitude_deg"
                                    style="height: 100%; width: 100%"
                                    :options="{ zoomControl: false, dragging: false, scrollWheelZoom: false }"
                                    :zoom="15" :center="[airport.latitude_deg, airport.longitude_deg]">
                                    <l-tile-layer
                                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"></l-tile-layer>
                                    <l-marker :lat-lng="[airport.latitude_deg, airport.longitude_deg]">
                                        <l-popup>{{ airport.name }}</l-popup>
                                    </l-marker>
                                </l-map>
                                <div v-else class="map-placeholder">
                                    <i class="bi bi-geo-alt"></i>
                                    <span>Mapa no disponible</span>
                                </div>
                            </div>
                        </div>

                        <!-- Stats Section -->
                        <div class="info-section" v-if="flightStats">
                            <h6 class="section-title">
                                <i class="bi bi-bar-chart-fill"></i>
                                Estadísticas de Vuelos
                            </h6>
                            <div class="stats-row">
                                <div class="stat-card arrivals">
                                    <i class="bi bi-arrow-down-circle-fill"></i>
                                    <div class="stat-content">
                                        <span class="stat-number">{{ flightStats.arrivals }}</span>
                                        <span class="stat-label">Llegadas</span>
                                    </div>
                                </div>
                                <div class="stat-card departures">
                                    <i class="bi bi-arrow-up-circle-fill"></i>
                                    <div class="stat-content">
                                        <span class="stat-number">{{ flightStats.departures }}</span>
                                        <span class="stat-label">Salidas</span>
                                    </div>
                                </div>
                                <div class="stat-card active">
                                    <i class="bi bi-airplane-fill"></i>
                                    <div class="stat-content">
                                        <span class="stat-number">{{ flightStats.active }}</span>
                                        <span class="stat-label">En vuelo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="modal-footer">
                        <a :href="googleMapsUrl" target="_blank" rel="noopener noreferrer" class="btn-action external">
                            <i class="bi bi-geo-alt me-2"></i>
                            Abrir en Google Maps
                        </a>
                        <button class="btn-action primary" @click="closeModal">
                            <i class="bi bi-check-lg me-2"></i>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

export default {
    name: 'AirportModal',

    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup
    },

    props: {
        show: {
            type: Boolean,
            default: false
        },
        airport: {
            type: Object,
            default: null
        },
        flightStats: {
            type: Object,
            default: null
        }
    },

    emits: ['close'],

    computed: {
        googleMapsUrl() {
            if (!this.airport?.latitude_deg || !this.airport?.longitude_deg) {
                return '#';
            }
            return `https://www.google.com/maps?q=${this.airport.latitude_deg},${this.airport.longitude_deg}`;
        }
    },

    watch: {
        show(newVal) {
            if (newVal) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    },

    methods: {
        closeModal() {
            this.$emit('close');
        },

        formatRegion(isoRegion) {
            if (!isoRegion) return 'No disponible';
            // PE-LIM -> Lima
            const regionCode = isoRegion.split('-')[1];
            const regions = {
                'AMA': 'Amazonas',
                'ANC': 'Áncash',
                'APU': 'Apurímac',
                'ARE': 'Arequipa',
                'AYA': 'Ayacucho',
                'CAJ': 'Cajamarca',
                'CAL': 'Callao',
                'CUS': 'Cusco',
                'HUC': 'Huánuco',
                'HUV': 'Huancavelica',
                'ICA': 'Ica',
                'JUN': 'Junín',
                'LAL': 'La Libertad',
                'LAM': 'Lambayeque',
                'LIM': 'Lima',
                'LOR': 'Loreto',
                'MDD': 'Madre de Dios',
                'MOQ': 'Moquegua',
                'PAS': 'Pasco',
                'PIU': 'Piura',
                'PUN': 'Puno',
                'SAM': 'San Martín',
                'TAC': 'Tacna',
                'TUM': 'Tumbes',
                'UCA': 'Ucayali'
            };
            return regions[regionCode] || regionCode || isoRegion;
        },

        formatCoord(value, positive, negative) {
            if (!value && value !== 0) return 'N/A';
            const absValue = Math.abs(value);
            const degrees = Math.floor(absValue);
            const minutes = Math.floor((absValue - degrees) * 60);
            const seconds = ((absValue - degrees - minutes / 60) * 3600).toFixed(1);
            const direction = value >= 0 ? positive : negative;
            return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
        }
    }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   MODAL OVERLAY
   ═══════════════════════════════════════════════════════════ */

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

/* ═══════════════════════════════════════════════════════════
   MODAL CONTAINER
   ═══════════════════════════════════════════════════════════ */

.modal-container {
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%);
    border-radius: 20px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* ═══════════════════════════════════════════════════════════
   MODAL HEADER
   ═══════════════════════════════════════════════════════════ */

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
}

.header-content {
    flex: 1;
}

.airport-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--type-arrival-bg, rgba(52, 152, 219, 0.15));
    border-radius: 8px;
    margin-bottom: 12px;
}

.airport-badge i {
    color: var(--type-arrival, #3498db);
}

.badge-code {
    font-family: var(--font-family-mono, monospace);
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--type-arrival, #3498db);
}

.modal-title {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-text-primary, #fff);
    line-height: 1.3;
}

.close-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-muted, #888);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.close-btn:hover {
    background: rgba(231, 76, 60, 0.2);
    border-color: rgba(231, 76, 60, 0.3);
    color: #e74c3c;
}

/* ═══════════════════════════════════════════════════════════
   MODAL BODY
   ═══════════════════════════════════════════════════════════ */

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    min-height: 0;
}

.info-section {
    margin-bottom: 24px;
}

.info-section:last-child {
    margin-bottom: 0;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 16px 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary, #fff);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.section-title i {
    color: var(--type-arrival, #3498db);
    font-size: 1rem;
}

/* Info Grid */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
}

.info-item {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    padding: 14px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-label {
    display: block;
    font-size: 0.75rem;
    color: var(--color-text-muted, #888);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
}

.info-value {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary, #fff);
}

.country-flag {
    width: 20px;
    height: auto;
    border-radius: 2px;
}

/* Coordinates */
.coords-display {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.coord-item {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    padding: 14px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.coord-label {
    display: block;
    font-size: 0.75rem;
    color: var(--color-text-muted, #888);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
}

.coord-value {
    font-family: var(--font-family-mono, monospace);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-primary, #fff);
}

/* Map Preview */
.map-preview {
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    background: var(--color-bg-tertiary, #16213e);
}

.map-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--color-text-muted, #666);
}

.map-placeholder i {
    font-size: 2rem;
    opacity: 0.5;
}

/* Stats Row */
.stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-card i {
    font-size: 1.5rem;
}

.stat-card.arrivals {
    border-left: 3px solid var(--type-arrival, #3498db);
}

.stat-card.arrivals i {
    color: var(--type-arrival, #3498db);
}

.stat-card.departures {
    border-left: 3px solid var(--type-departure, #e67e22);
}

.stat-card.departures i {
    color: var(--type-departure, #e67e22);
}

.stat-card.active {
    border-left: 3px solid var(--status-active, #27ae60);
}

.stat-card.active i {
    color: var(--status-active, #27ae60);
}

.stat-content {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 1.4rem;
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

/* ═══════════════════════════════════════════════════════════
   MODAL FOOTER
   ═══════════════════════════════════════════════════════════ */

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
}

.btn-action {
    display: inline-flex;
    align-items: center;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    border: none;
}

.btn-action.external {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--color-text-secondary, #e0e0e0);
}

.btn-action.external:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text-primary, #fff);
}

.btn-action.primary {
    background: var(--type-arrival-gradient, linear-gradient(135deg, #3498db 0%, #2980b9 100%));
    color: white;
}

.btn-action.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

/* ═══════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════ */

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.3s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
    transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
    transform: scale(0.95) translateY(20px);
    opacity: 0;
}

/* ═══════════════════════════════════════════════════════════
   SCROLLBAR
   ═══════════════════════════════════════════════════════════ */

.modal-body::-webkit-scrollbar {
    width: 6px;
}

.modal-body::-webkit-scrollbar-track {
    background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 576px) {
    .modal-overlay {
        padding: 10px;
    }

    .modal-container {
        max-height: 95vh;
        border-radius: 16px;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 16px;
    }

    .modal-title {
        font-size: 1.2rem;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .coords-display {
        grid-template-columns: 1fr;
    }

    .stats-row {
        grid-template-columns: 1fr;
    }

    .modal-footer {
        flex-direction: column;
    }

    .btn-action {
        width: 100%;
        justify-content: center;
    }
}
</style>
