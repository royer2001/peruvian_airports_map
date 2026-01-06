<template>
    <div v-if="isLoading" class="preloader">
        <div class="loading-circle"></div> Loading...
    </div>
</template>

<script>
export default {

    props: {
        isLoading: {
            type: Boolean,
            required: true
        }
    },
}
</script>

<style scoped>
.preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    /* Fondo semi-transparente */
    backdrop-filter: blur(5px);
    /* Efecto de desenfoque */
    color: #fff;
    font-size: 1.5em;
    z-index: 9999;
}

.loading-circle {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>