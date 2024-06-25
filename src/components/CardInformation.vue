<template>
    <div class="card m-2 p-2">
        <div class="card-body">
            <h5 class="info-title card-title">INFORMATION</h5>
            <div class="row">
                <div class="col-md-4 col-sm-4">
                    <div class="info-card">
                        <i class="info-icon bi bi-geo-alt"></i>
                        <div class="info-text">
                            <div class="info-title">Location</div>
                            <div class="info-description">{{ selectedAirport.municipality }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 col-sm-4">
                    <div class="info-card">
                        <i class="info-icon bi bi-globe-americas"></i>
                        <div class="info-text">
                            <div class="info-title">Country</div>
                            <div class="info-description">{{ selectedAirport.iso_country }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 col-sm-4">
                    <div class="info-card">
                        <i class="info-icon bi bi-building"></i>
                        <div class="info-text">
                            <div class="info-title">Region</div>
                            <div class="info-description">{{ selectedAirport.iso_region }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-sm-6">
                    <div class="info-card">
                        <i class="info-icon bi bi-airplane-fill"></i>
                        <div class="info-text">
                            <div class="info-title">Airport</div>
                            <div class="info-description">{{ selectedAirport.name }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-sm-6">
                    <div class="info-card">
                        <i class="info-icon bi bi-pin-map-fill"></i>
                        <div class="info-text">
                            <div class="info-title">Long., Lat.</div>
                            <div class="info-description">{{ selectedAirport.latitude_deg }}, {{
                                selectedAirport.longitude_deg }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-grid gap-2 d-md-block m-2">
                <button @click="openInGoogleMaps" class="btn btn-outline-success" type="button"><i
                        class="bi bi-map"></i> VIEW IN GOOGLE MAPS</button>
            </div>
        </div>

    </div>
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