<template>
    <div class="flight-card-v2" :class="[statusClass, typeClass, { 'status-changed': isHighlighted }]" role="article"
        :aria-label="`Vuelo ${flightCode}, ${statusInfo.label}`">
        <!-- Indicador de tipo (llegada/salida) -->
        <div class="flight-type-indicator">
            <i :class="isDeparture ? 'bi-arrow-up-circle-fill' : 'bi-arrow-down-circle-fill'"></i>
        </div>

        <!-- Header: Número de vuelo + Estado -->
        <div class="card-header-v2">
            <div class="flight-identity">
                <span class="flight-code">{{ flightCode }}</span>
                <span class="airline-chip">{{ airlineShort }}</span>
            </div>
            <div class="status-pill" :style="{ background: statusInfo.gradient }">
                <i :class="['bi', statusInfo.icon]"></i>
                <span>{{ statusInfo.label }}</span>
            </div>
        </div>

        <!-- Ruta visual simplificada -->
        <div class="route-visual">
            <div class="route-point origin">
                <span class="airport-code">{{ departureCode }}</span>
                <span class="airport-city">{{ departureCity }}</span>
                <span class="time-value" :class="{ 'delayed': hasDepDelay }">{{ departureTime }}</span>
            </div>

            <div class="route-connector">
                <div class="line"></div>
                <i class="bi-airplane route-plane" :class="{ 'in-flight': isActive }"></i>
                <div class="line"></div>
            </div>

            <div class="route-point destination">
                <span class="airport-code">{{ arrivalCode }}</span>
                <span class="airport-city">{{ arrivalCity }}</span>
                <span class="time-value" :class="{ 'delayed': hasArrDelay }">{{ arrivalTime }}</span>
            </div>
        </div>

        <!-- Alertas de retraso (solo si aplica) -->
        <div v-if="hasDelay" class="delay-alert">
            <i class="bi-exclamation-triangle-fill"></i>
            <span>Retraso: {{ totalDelay }} min</span>
        </div>

        <!-- Información de vuelo en vivo -->
        <div v-if="flight.live" class="live-info">
            <span class="live-badge">
                <span class="pulse-dot"></span>
                EN VUELO
            </span>
            <span class="live-data">
                <i class="bi-arrow-up"></i> {{ altitude }}m
            </span>
            <span class="live-data">
                <i class="bi-speedometer2"></i> {{ speed }} km/h
            </span>
        </div>
    </div>
</template>

<script>
import { formatFlightStatus, formatTime } from '@/services/flights.services'

export default {
    name: 'FlightCard',

    props: {
        flight: {
            type: Object,
            required: true
        },
        isDeparture: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            isHighlighted: false,
            previousStatus: null
        }
    },

    computed: {
        flightCode() {
            return this.flight.flight?.iata || this.flight.flight?.icao || 'N/A'
        },

        statusInfo() {
            const status = formatFlightStatus(this.flight.flight_status)
            // Añadir gradientes para píldoras de estado
            const gradients = {
                active: 'var(--status-active-gradient)',
                landed: 'var(--status-landed-gradient)',
                scheduled: 'var(--status-scheduled-gradient)',
                cancelled: 'var(--status-cancelled-gradient)',
                delayed: 'var(--status-delayed-gradient)',
                diverted: 'var(--status-diverted-gradient)'
            }
            return {
                ...status,
                gradient: gradients[this.flight.flight_status] || 'var(--status-scheduled-gradient)'
            }
        },

        statusClass() {
            return `status-${this.flight.flight_status || 'scheduled'}`
        },

        typeClass() {
            return this.isDeparture ? 'type-departure' : 'type-arrival'
        },

        isActive() {
            return this.flight.flight_status === 'active'
        },

        departureCode() {
            return this.flight.departure?.iata || this.flight.departure?.icao || '---'
        },

        departureCity() {
            const airport = this.flight.departure?.airport || ''
            return airport.split(' ')[0] || ''
        },

        arrivalCode() {
            return this.flight.arrival?.iata || this.flight.arrival?.icao || '---'
        },

        arrivalCity() {
            const airport = this.flight.arrival?.airport || ''
            return airport.split(' ')[0] || ''
        },

        departureTime() {
            return formatTime(this.flight.departure?.scheduled)
        },

        arrivalTime() {
            return formatTime(this.flight.arrival?.scheduled)
        },

        airlineShort() {
            const name = this.flight.airline?.name || 'Aerolínea'
            // Abreviar nombres largos
            if (name.length > 15) {
                return name.split(' ').map(w => w[0]).join('').toUpperCase()
            }
            return name
        },

        hasDepDelay() {
            return this.flight.departure?.delay && this.flight.departure.delay > 0
        },

        hasArrDelay() {
            return this.flight.arrival?.delay && this.flight.arrival.delay > 0
        },

        hasDelay() {
            return this.hasDepDelay || this.hasArrDelay
        },

        totalDelay() {
            return Math.max(
                this.flight.departure?.delay || 0,
                this.flight.arrival?.delay || 0
            )
        },

        altitude() {
            return this.flight.live?.altitude ? Math.round(this.flight.live.altitude) : 0
        },

        speed() {
            return this.flight.live?.speed_horizontal ? Math.round(this.flight.live.speed_horizontal) : 0
        }
    },

    watch: {
        'flight.flight_status': {
            handler(newStatus, oldStatus) {
                if (oldStatus && newStatus !== oldStatus) {
                    this.highlightChange()
                }
            }
        }
    },

    methods: {
        highlightChange() {
            this.isHighlighted = true
            setTimeout(() => {
                this.isHighlighted = false
            }, 3000)
        }
    }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   FLIGHT CARD V2 - DISEÑO MEJORADO
   ═══════════════════════════════════════════════════════════ */

.flight-card-v2 {
    position: relative;
    background: var(--color-bg-card, rgba(255, 255, 255, 0.03));
    border-radius: var(--radius-xl, 16px);
    padding: var(--spacing-lg, 16px);
    margin-bottom: var(--spacing-md, 12px);
    color: var(--color-text-secondary, #e0e0e0);
    border-left: 5px solid var(--status-scheduled, #3498db);
    transition: all var(--transition-normal, 0.2s ease);
    overflow: hidden;
}

.flight-card-v2:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg, 0 8px 25px rgba(0, 0, 0, 0.3));
    background: rgba(255, 255, 255, 0.05);
}

/* ═══════════════════════════════════════════════════════════
   ESTADOS DE VUELO - COLORES DE BORDE
   ═══════════════════════════════════════════════════════════ */

.flight-card-v2.status-active {
    border-left-color: var(--status-active, #27ae60);
}

.flight-card-v2.status-scheduled {
    border-left-color: var(--status-scheduled, #3498db);
}

.flight-card-v2.status-landed {
    border-left-color: var(--status-landed, #2ecc71);
}

.flight-card-v2.status-cancelled {
    border-left-color: var(--status-cancelled, #e74c3c);
    opacity: 0.65;
}

.flight-card-v2.status-incident,
.flight-card-v2.status-diverted {
    border-left-color: var(--status-delayed, #f39c12);
}

/* ═══════════════════════════════════════════════════════════
   INDICADOR DE TIPO (LLEGADA/SALIDA)
   ═══════════════════════════════════════════════════════════ */

.flight-type-indicator {
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px 14px;
    border-radius: 0 var(--radius-xl, 16px) 0 var(--radius-lg, 12px);
    font-size: 1.1rem;
}

.flight-card-v2.type-arrival .flight-type-indicator {
    background: var(--type-arrival-bg, rgba(52, 152, 219, 0.2));
    color: var(--type-arrival, #3498db);
}

.flight-card-v2.type-departure .flight-type-indicator {
    background: var(--type-departure-bg, rgba(230, 126, 34, 0.2));
    color: var(--type-departure, #e67e22);
}

/* ═══════════════════════════════════════════════════════════
   HEADER - IDENTIDAD DEL VUELO
   ═══════════════════════════════════════════════════════════ */

.card-header-v2 {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-lg, 16px);
    padding-right: 50px;
    /* Espacio para el indicador de tipo */
}

.flight-identity {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 8px);
}

.flight-code {
    font-size: var(--font-size-lg, 1.1rem);
    font-weight: var(--font-weight-bold, 700);
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-primary, #fff);
    letter-spacing: 0.5px;
}

.airline-chip {
    font-size: var(--font-size-xs, 0.7rem);
    padding: 3px 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-full, 9999px);
    color: var(--color-text-muted, #888);
}

/* ═══════════════════════════════════════════════════════════
   PÍLDORA DE ESTADO
   ═══════════════════════════════════════════════════════════ */

.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: var(--radius-full, 20px);
    font-size: var(--font-size-sm, 0.8rem);
    font-weight: var(--font-weight-semibold, 600);
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.status-pill i {
    font-size: 0.9rem;
}

/* ═══════════════════════════════════════════════════════════
   RUTA VISUAL
   ═══════════════════════════════════════════════════════════ */

.route-visual {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: var(--spacing-lg, 16px) 0;
}

.route-point {
    display: flex;
    flex-direction: column;
    min-width: 70px;
}

.route-point.origin {
    align-items: flex-start;
}

.route-point.destination {
    align-items: flex-end;
    text-align: right;
}

.airport-code {
    font-size: var(--font-size-xl, 1.4rem);
    font-weight: var(--font-weight-bold, 700);
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-primary, #fff);
    letter-spacing: 1px;
}

.airport-city {
    font-size: var(--font-size-xs, 0.7rem);
    color: var(--color-text-muted, #888);
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 4px;
}

.time-value {
    font-size: var(--font-size-xl, 1.4rem);
    font-weight: var(--font-weight-bold, 700);
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-primary, #fff);
    letter-spacing: -0.5px;
}

.time-value.delayed {
    color: var(--status-delayed, #f39c12);
}

/* ═══════════════════════════════════════════════════════════
   CONECTOR DE RUTA (LÍNEA CON AVIÓN)
   ═══════════════════════════════════════════════════════════ */

.route-connector {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 0 var(--spacing-md, 12px);
    padding-top: 24px;
    /* Ajuste para alinear con los códigos */
}

.route-connector .line {
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg,
            var(--type-arrival, #3498db) 0%,
            var(--type-departure, #e67e22) 100%);
    opacity: 0.5;
}

.route-plane {
    margin: 0 var(--spacing-sm, 8px);
    color: var(--color-text-muted, #888);
    font-size: 1.2rem;
    transform: rotate(90deg);
    transition: all var(--transition-normal, 0.2s ease);
}

.route-plane.in-flight {
    color: var(--status-active, #27ae60);
    animation: var(--animation-pulse, pulse 2s infinite);
}

/* ═══════════════════════════════════════════════════════════
   ALERTA DE RETRASO
   ═══════════════════════════════════════════════════════════ */

.delay-alert {
    margin-top: var(--spacing-md, 12px);
    padding: var(--spacing-sm, 8px) var(--spacing-md, 12px);
    background: var(--status-delayed-bg, rgba(243, 156, 18, 0.15));
    border-radius: var(--radius-md, 8px);
    color: var(--status-delayed, #f39c12);
    font-size: var(--font-size-sm, 0.85rem);
    font-weight: var(--font-weight-medium, 500);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 8px);
}

.delay-alert i {
    font-size: 1rem;
}

/* ═══════════════════════════════════════════════════════════
   INFORMACIÓN EN VIVO
   ═══════════════════════════════════════════════════════════ */

.live-info {
    margin-top: var(--spacing-md, 12px);
    padding-top: var(--spacing-md, 12px);
    border-top: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
    display: flex;
    align-items: center;
    gap: var(--spacing-lg, 16px);
    font-size: var(--font-size-sm, 0.8rem);
}

.live-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--status-active, #27ae60);
    font-weight: var(--font-weight-semibold, 600);
    letter-spacing: 0.5px;
}

.pulse-dot {
    width: 8px;
    height: 8px;
    background: var(--status-active, #27ae60);
    border-radius: 50%;
    animation: var(--animation-pulse, pulse 2s infinite);
}

.live-data {
    color: var(--color-text-muted, #888);
    display: flex;
    align-items: center;
    gap: 4px;
}

.live-data i {
    font-size: 0.9rem;
}

/* ═══════════════════════════════════════════════════════════
   ANIMACIÓN DE CAMBIO DE ESTADO
   ═══════════════════════════════════════════════════════════ */

.flight-card-v2.status-changed {
    animation: highlight-change 3s ease;
}

@keyframes highlight-change {

    0%,
    100% {
        background: var(--color-bg-card, rgba(255, 255, 255, 0.03));
    }

    10% {
        background: rgba(52, 152, 219, 0.2);
        box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
    }
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE - MÓVILES
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 576px) {
    .flight-card-v2 {
        padding: var(--spacing-md, 12px);
        border-radius: var(--radius-lg, 12px);
    }

    .card-header-v2 {
        flex-direction: column;
        gap: var(--spacing-sm, 8px);
        padding-right: 40px;
    }

    .airport-code {
        font-size: var(--font-size-lg, 1.1rem);
    }

    .time-value {
        font-size: var(--font-size-lg, 1.1rem);
    }

    .route-connector {
        margin: 0 var(--spacing-sm, 8px);
    }

    .live-info {
        flex-wrap: wrap;
        gap: var(--spacing-sm, 8px);
    }

    .flight-type-indicator {
        padding: 6px 10px;
        font-size: 0.9rem;
    }
}

/* ═══════════════════════════════════════════════════════════
   MODO KIOSKO - PANTALLAS GRANDES
   ═══════════════════════════════════════════════════════════ */

@media (min-width: 1400px) {
    .flight-card-v2 {
        padding: var(--spacing-xl, 20px) var(--spacing-2xl, 24px);
    }

    .airport-code {
        font-size: var(--font-size-2xl, 1.8rem);
    }

    .time-value {
        font-size: var(--font-size-2xl, 1.8rem);
    }

    .status-pill {
        padding: 10px 20px;
        font-size: 1rem;
    }

    .flight-code {
        font-size: var(--font-size-xl, 1.4rem);
    }
}
</style>
