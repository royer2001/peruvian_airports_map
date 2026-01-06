<template>
    <div class="jumbotron-image p-5 mb-4 bg-info text-white" v-bind:style="bgHeader">
        <h1 class="mb-4">{{ headerPresentation.title }}</h1>
        <p class="mb-4">{{ headerPresentation.description }}</p>
    </div>
</template>

<script>
import bgHeaderImg from '../assets/bg_header.jpg'

export default {
    data() {
        return {
            headerPresentation: {
                title: 'PERUVIAN AIRPORTS',
                description: 'Know the main airports in Peru.',
            },
        }
    },

    computed: {
        bgHeader() {
            return {
                backgroundImage: `url(${bgHeaderImg})`
            };
        }
    }
}
</script>
<style scoped>
.jumbotron-image {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
