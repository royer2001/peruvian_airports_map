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

<style>
.preloader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333;
    color: #fff;
    font-size: 1.5em;
    z-index: 1000;
}

.loading-circle {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin-right: 10px;
    /* Espacio entre el círculo y el texto */
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