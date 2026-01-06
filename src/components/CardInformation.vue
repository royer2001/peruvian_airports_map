<template>
    <b-card m="2" p="2" class="shadow-sm border-0">
        <b-card-title class="info-title mb-4 text-primary">
            <i class="bi bi-info-circle-fill me-2"></i>INFORMATION
        </b-card-title>

        <b-row>
            <b-col md="4" sm="12" class="mb-3">
                <div class="info-card h-100">
                    <i class="info-icon bi bi-geo-alt"></i>
                    <div class="info-text">
                        <div class="info-label">Location</div>
                        <div class="info-value">{{ selectedAirport.municipality }}</div>
                    </div>
                </div>
            </b-col>

            <b-col md="4" sm="12" class="mb-3">
                <div class="info-card h-100">
                    <i class="info-icon bi bi-globe-americas"></i>
                    <div class="info-text">
                        <div class="info-label">Country</div>
                        <div class="info-value">{{ selectedAirport.iso_country }}</div>
                    </div>
                </div>
            </b-col>

            <b-col md="4" sm="12" class="mb-3">
                <div class="info-card h-100">
                    <i class="info-icon bi bi-building"></i>
                    <div class="info-text">
                        <div class="info-label">Region</div>
                        <div class="info-value">{{ selectedAirport.iso_region }}</div>
                    </div>
                </div>
            </b-col>
        </b-row>

        <b-row>
            <b-col md="6" sm="12" class="mb-3">
                <div class="info-card h-100 airport-highlight">
                    <i class="info-icon bi bi-airplane-fill"></i>
                    <div class="info-text">
                        <div class="info-label">Airport</div>
                        <div class="info-value">{{ selectedAirport.name }}</div>
                    </div>
                </div>
            </b-col>

            <b-col md="6" sm="12" class="mb-3">
                <div class="info-card h-100">
                    <i class="info-icon bi bi-pin-map-fill"></i>
                    <div class="info-text">
                        <div class="info-label">Coordinates</div>
                        <div class="info-value">
                            {{ selectedAirport.latitude_deg }}, {{ selectedAirport.longitude_deg }}
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>

        <div class="mt-3">
            <b-button @click="openInGoogleMaps" variant="outline-success"
                class="w-100 d-flex align-items-center justify-content-center">
                <i class="bi bi-map me-2"></i> VIEW IN GOOGLE MAPS
            </b-button>
        </div>
    </b-card>
</template>

<script>
export default {
    props: {
        selectedAirport: {
            type: Object,
            default: () => { }
        }
    },
    methods: {
        openInGoogleMaps() {

            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


            const { latitude_deg, longitude_deg } = this.selectedAirport
            const baseUrl = isMobile ? `geo:${latitude_deg},${longitude_deg},` : `https://www.google.com/maps/search/?api=1&query=${latitude_deg},${longitude_deg}`

            window.open(baseUrl, '_blank')
        }
    }


}
</script>

<style>
.info-card {
    background-color: #2e2e2e;
    border-radius: 20px;
    padding: 10px;
    color: #d7ccc8;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.info-icon {
    font-size: 1.5rem;
    margin-right: 20px;
    margin-bottom: 0px;
}

.info-text {
    flex-grow: 1;
}

.info-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.info-description {
    font-size: 0.8rem;
    color: #c7a693;
}

@media (max-width: 576px) {
    .info-card {
        text-align: center;
    }

    .info-icon {
        margin-right: 0;
        margin-bottom: 10px;
    }
}
</style>