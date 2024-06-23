<template>
    <div class="card m-2 p-3">
        <h3 class="info-title">INFORMATION</h3>
        <div class="row">
            <div class="col-md-4 col-sm-3">
                <div class="info-card">
                    <i class="info-icon fas fa-bluetooth"></i>
                    <div class="info-text">
                        <div class="info-title">Location</div>
                        <div class="info-description">{{ selectedAirport.municipality }}</div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-3">
                <div class="info-card">
                    <i class="info-icon fas fa-bluetooth"></i>
                    <div class="info-text">
                        <div class="info-title">Airport</div>
                        <div class="info-description">{{ selectedAirport.name }}</div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-3">
                <div class="info-card">
                    <i class="info-icon fas fa-bluetooth"></i>
                    <div class="info-text">
                        <div class="info-title">LON, LAT</div>
                        <div class="info-description">{{ selectedAirport.latitude_deg }}, {{
                            selectedAirport.longitude_deg }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-3">
                <div class="info-card">
                    <i class="info-icon fas fa-bluetooth"></i>
                    <div class="info-text">
                        <div class="info-title">Country</div>
                        <div class="info-description">{{ selectedAirport.iso_country }}</div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-3">
                <div class="info-card">
                    <i class="info-icon fas fa-bluetooth"></i>
                    <div class="info-text">
                        <div class="info-title">Region</div>
                        <div class="info-description">{{ selectedAirport.iso_region }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-grid gap-2 d-md-block m-2">
            <button class="btn btn-outline-success" type="button">View in maps</button>
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
    margin-bottom: 5px;
}

.info-icon {
    font-size: 1.5rem;
    margin-right: 20px;
}

.info-text {
    flex-grow: 1;
}

.info-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.info-description {
    font-size: 0.9rem;
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