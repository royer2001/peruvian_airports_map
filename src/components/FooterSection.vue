<template>
    <footer class="bg-light border-top mt-5">
        <b-container class="py-4">
            <b-row class="align-items-center">
                <b-col md="6" class="text-center text-md-start mb-3 mb-md-0">
                    <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                        <img src="@/assets/peru_flag.svg" style="width: 24px;" class="me-2" alt="Peru Flag">
                        <span class="text-muted fw-semibold">Peruvian Airports Map</span>
                    </div>
                </b-col>

                <b-col md="6" class="text-center text-md-end">
                    <small class="text-muted">
                        &copy; {{ currentYear }} - Explore Peru's Aviation Network
                    </small>
                </b-col>
            </b-row>

            <b-row class="mt-3">
                <b-col class="text-center">
                    <small class="text-muted">
                        <i class="bi bi-info-circle me-1"></i>
                        Data provided by <a href="https://airportdb.io" target="_blank"
                            class="text-decoration-none">AirportDB</a>
                    </small>
                </b-col>
            </b-row>
        </b-container>
    </footer>
</template>

<script>
export default {
    computed: {
        currentYear() {
            return new Date().getFullYear()
        }
    }
}
</script>

<style scoped>
footer {
    margin-top: auto;
}

footer a {
    color: #6c757d;
    transition: color 0.2s ease;
}

footer a:hover {
    color: #495057;
}
</style>