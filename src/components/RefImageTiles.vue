<script setup>
    import { ref, computed } from 'vue'
    
    import VirtualScroller from 'primevue/virtualscroller';

    import Galleria from 'primevue/galleria'
    import Image from 'primevue/image'
    import Card from 'primevue/card'

    const props = defineProps({
        images: {
            type: Array,
            default: () => [],
        },
    });

    const activeIndex = ref(0);
    const displayCustom = ref(false);

    const responsiveOptions = ref([
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ]);

    // Set up pagination

const segmentedImages = computed(() => {
    // Convert images to 2d array where each row has 5 images
    const rows = [];
    for (let i = 0; i < props.images.length; i += 5) {
        rows.push(props.images.slice(i, i + 5));
    }
    return rows;
});

const totalImages = computed(() => {
    return props.images.length;
});

</script>

<template>
    <div class="card flex justify-center">
        <VirtualScroller :items="segmentedImages" :itemSize="[250, 250]" orientation="both" :delay="150" class="border border-surface-200 dark:border-surface-700 rounded" style="width: 100%; height: 100vh;">            
            <template v-slot:item="{ item, options }">
                <div class="flex items-center p-2" style="height: 250px">
                    <template v-for="(el, index) of item" :key="index">
                        <Image :src="el.thumbnailImageSrc" :alt="el.alt" width="250" style="cursor: pointer" preview />
                    </template>
                    
                </div>
            </template>
        </VirtualScroller>
    </div>
</template>

<style scoped>
.scroller {
  height: 100%;
    width: 100%;
}
</style>