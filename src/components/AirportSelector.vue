<template>
    <div class="airport-selector-enhanced">
        <!-- Quick access chips para aeropuertos principales -->
        <div class="quick-airports">
            <button v-for="airport in mainAirports" :key="airport.icao" class="chip-airport"
                :class="{ active: modelValue === airport.icao }" @click="selectAirport(airport.icao)"
                :title="airport.name">
                <span class="chip-code">{{ airport.icao }}</span>
                <span class="chip-city">{{ airport.city }}</span>
            </button>
        </div>

        <!-- Input con búsqueda para otros aeropuertos -->
        <div class="search-wrapper" ref="searchWrapper">
            <i class="bi bi-search search-icon"></i>
            <input type="text" v-model="searchTerm" placeholder="Buscar aeropuerto por código o nombre..."
                class="search-input" @focus="showDropdown = true" @blur="handleBlur" autocomplete="off">
            <button v-if="searchTerm" class="clear-btn" @mousedown.prevent="clearSearch">
                <i class="bi bi-x-lg"></i>
            </button>

            <!-- Dropdown de resultados -->
            <transition name="dropdown">
                <div v-if="showDropdown && filteredAirports.length > 0" class="dropdown-results">
                    <div v-for="airport in filteredAirports" :key="airport.icao" class="dropdown-item"
                        :class="{ selected: modelValue === airport.icao }"
                        @mousedown.prevent="selectAirport(airport.icao)">
                        <div class="item-left">
                            <span class="item-code">{{ airport.icao }}</span>
                            <span class="item-name">{{ truncateName(airport.airport_name) }}</span>
                        </div>
                        <i v-if="modelValue === airport.icao" class="bi bi-check-lg item-check"></i>
                    </div>
                </div>
            </transition>

            <!-- Sin resultados -->
            <transition name="dropdown">
                <div v-if="showDropdown && searchTerm && filteredAirports.length === 0"
                    class="dropdown-results no-results">
                    <i class="bi bi-search"></i>
                    <span>No se encontraron aeropuertos</span>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { airports } from '@/data/airports'

export default {
    name: 'AirportSelector',

    props: {
        modelValue: {
            type: String,
            default: null
        }
    },

    emits: ['update:modelValue', 'change'],

    data() {
        return {
            searchTerm: '',
            showDropdown: false,
            airports: airports
        }
    },

    computed: {
        // Aeropuertos principales para acceso rápido
        mainAirports() {
            const mainCodes = ['SPIM', 'SPZO', 'SPQU', 'SPHI', 'SPQT']
            return mainCodes.map(code => {
                const airport = this.airports.find(a => a.icao === code)
                if (!airport) return null
                return {
                    icao: airport.icao,
                    city: this.getCityFromName(airport.airport_name),
                    name: airport.airport_name
                }
            }).filter(Boolean)
        },

        // Aeropuertos filtrados por búsqueda
        filteredAirports() {
            if (!this.searchTerm) {
                return this.airports.slice(0, 10)
            }

            const term = this.searchTerm.toLowerCase()
            return this.airports.filter(airport =>
                airport.icao.toLowerCase().includes(term) ||
                airport.airport_name.toLowerCase().includes(term)
            ).slice(0, 10)
        }
    },

    methods: {
        selectAirport(icao) {
            this.$emit('update:modelValue', icao)
            this.$emit('change', icao)
            this.searchTerm = ''
            this.showDropdown = false
        },

        getCityFromName(name) {
            // Extraer ciudad del nombre del aeropuerto
            const cityMap = {
                'Jorge Chávez': 'Lima',
                'Alejandro Velasco Astete': 'Cusco',
                'Rodríguez Ballón': 'Arequipa',
                'Jose A Quinones': 'Chiclayo',
                'Francisco Secada': 'Iquitos'
            }

            for (const [key, city] of Object.entries(cityMap)) {
                if (name.includes(key)) return city
            }

            // Fallback: primera palabra
            return name.split(' ')[0]
        },

        truncateName(name) {
            return name.length > 35 ? name.substring(0, 35) + '...' : name
        },

        clearSearch() {
            this.searchTerm = ''
        },

        handleBlur() {
            // Delay para permitir click en dropdown items
            setTimeout(() => {
                this.showDropdown = false
            }, 150)
        }
    }
}
</script>

<style scoped>
.airport-selector-enhanced {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 12px);
}

/* ═══════════════════════════════════════════════════════════
   CHIPS DE ACCESO RÁPIDO
   ═══════════════════════════════════════════════════════════ */

.quick-airports {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip-airport {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 14px;
    background: var(--color-bg-card, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-lg, 12px);
    color: var(--color-text-muted, #888);
    cursor: pointer;
    transition: all var(--transition-normal, 0.2s ease);
    min-width: 70px;
}

.chip-airport:hover {
    background: var(--color-bg-tertiary, rgba(255, 255, 255, 0.1));
    border-color: var(--color-border-hover, rgba(255, 255, 255, 0.2));
    color: var(--color-text-secondary, #e0e0e0);
    transform: translateY(-2px);
}

.chip-airport.active {
    background: var(--type-arrival-gradient, linear-gradient(135deg, #3498db 0%, #2980b9 100%));
    border-color: transparent;
    color: white;
    box-shadow: var(--shadow-glow, 0 0 20px rgba(74, 144, 217, 0.3));
}

.chip-code {
    font-size: var(--font-size-sm, 0.8rem);
    font-weight: var(--font-weight-bold, 700);
    font-family: var(--font-family-mono, monospace);
}

.chip-city {
    font-size: var(--font-size-xs, 0.7rem);
    opacity: 0.8;
}

/* ═══════════════════════════════════════════════════════════
   BARRA DE BÚSQUEDA
   ═══════════════════════════════════════════════════════════ */

.search-wrapper {
    position: relative;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted, #888);
    font-size: 0.9rem;
    pointer-events: none;
}

.search-input {
    width: 100%;
    padding: 12px 40px 12px 40px;
    background: var(--color-bg-tertiary, #16213e);
    border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-lg, 12px);
    color: var(--color-text-secondary, #e0e0e0);
    font-size: var(--font-size-base, 0.9rem);
    transition: all var(--transition-normal, 0.2s ease);
}

.search-input::placeholder {
    color: var(--color-text-muted, #666);
}

.search-input:focus {
    outline: none;
    border-color: var(--color-border-focus, #4a90d9);
    box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.15);
}

.clear-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
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

.clear-btn:hover {
    color: var(--color-text-primary, #fff);
    background: rgba(255, 255, 255, 0.1);
}

/* ═══════════════════════════════════════════════════════════
   DROPDOWN DE RESULTADOS
   ═══════════════════════════════════════════════════════════ */

.dropdown-results {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: var(--color-bg-secondary, #1a1a2e);
    border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-lg, 12px);
    max-height: 280px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: var(--shadow-lg, 0 8px 25px rgba(0, 0, 0, 0.25));
}

.dropdown-results.no-results {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px;
    color: var(--color-text-muted, #888);
    font-size: var(--font-size-sm, 0.85rem);
}

.dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: background var(--transition-fast, 0.15s ease);
    border-bottom: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.05));
}

.dropdown-item:last-child {
    border-bottom: none;
}

.dropdown-item:hover {
    background: var(--color-bg-card, rgba(255, 255, 255, 0.05));
}

.dropdown-item.selected {
    background: var(--type-arrival-bg, rgba(52, 152, 219, 0.1));
}

.item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    overflow: hidden;
}

.item-code {
    font-family: var(--font-family-mono, monospace);
    font-weight: var(--font-weight-bold, 700);
    font-size: var(--font-size-sm, 0.85rem);
    color: var(--type-arrival, #3498db);
    background: var(--type-arrival-bg, rgba(52, 152, 219, 0.15));
    padding: 4px 8px;
    border-radius: var(--radius-sm, 6px);
    flex-shrink: 0;
}

.item-name {
    font-size: var(--font-size-sm, 0.85rem);
    color: var(--color-text-secondary, #e0e0e0);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-check {
    color: var(--status-active, #27ae60);
    font-size: 1rem;
}

/* ═══════════════════════════════════════════════════════════
   TRANSICIONES
   ═══════════════════════════════════════════════════════════ */

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* ═══════════════════════════════════════════════════════════
   SCROLLBAR PERSONALIZADO
   ═══════════════════════════════════════════════════════════ */

.dropdown-results::-webkit-scrollbar {
    width: 6px;
}

.dropdown-results::-webkit-scrollbar-track {
    background: transparent;
}

.dropdown-results::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.dropdown-results::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 576px) {
    .quick-airports {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 8px;
        margin-bottom: -8px;
        -webkit-overflow-scrolling: touch;
    }

    .chip-airport {
        min-width: 65px;
        padding: 6px 10px;
        flex-shrink: 0;
    }

    .chip-code {
        font-size: 0.75rem;
    }

    .chip-city {
        font-size: 0.65rem;
    }
}
</style>
