<template>
    <div class="mb-2 p-5 bg-info text-white rounded">
        <h1>{{ headerPresentation.title }}</h1>
        <p>{{ headerPresentation.description }}</p>
    </div>
</template>

<script>

export default {
    data() {
        return {
            headerPresentation: {
                title: 'PERUVIAN AIRPORTS',
                description: 'Learn about Peru airports.',
            },
        }
    }
}

</script>