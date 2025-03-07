<script setup>
    import { ref } from 'vue'
    
    import Image from 'primevue/image'
    import DataView from 'primevue/dataview'
    import SelectButton from 'primevue/selectbutton'

    defineProps({
        images: {
            type: Array,
            default: () => [],
        },
    });

    const layout = ref('grid');
    const options = ref(['list', 'grid']);

</script>

<template>
    <div class="card">
        <DataView :value="images" :layout="layout" paginator :rows="10">
            <template #header>
                <div class="flex justify-end">
                    <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                        <template #option="{ option }">
                            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                        </template>
                    </SelectButton>
                </div>
            </template>

            <template #list="slotProps">
                <div class="flex flex-col">
                    <div v-for="(item, index) in slotProps.items" :key="index">
                        <div class="flex flex-col sm:flex-row sm:items-center p-3 gap-2" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                            <div class="md:w-40 relative">
                                <Image :src="item.thumbnailImageSrc" :alt="item.alt" class="block xl:block mx-auto rounded w-full" style="cursor: pointer" preview />
                            </div>
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                    <div>
                                        <div class="text-lg font-medium mt-2">{{ item.title }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div class="grid grid-cols-12 gap-4">
                    <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-2 p-2">
                        <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                            <div class="bg-surface-50 flex justify-center rounded p-4">
                                <div class="relative mx-auto">
                                    <Image :src="item.thumbnailImageSrc" :alt="item.alt" class="block xl:block mx-auto rounded w-full" style="cursor: pointer" preview />
                                </div>
                            </div>
                            <div class="pt-6">
                                <div class="flex flex-row justify-between items-start gap-2">
                                    <div>
                                        <div class="text-lg font-medium mt-1">{{ item.title }}</div>
                                    </div>
    
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>

<style scoped>
.scroller {
  height: 100%;
    width: 100%;
}
</style>