<script setup>
    import { ref } from 'vue';

    import InputNumber from 'primevue/inputnumber'
    import Button from 'primevue/button';
    import Dialog from 'primevue/dialog';
    import Image from 'primevue/image';
    import DataView from 'primevue/dataview';
    import SelectButton from 'primevue/selectbutton';

    const props = defineProps({
        images: {
            type: Array,
            default: () => [],
        },
    });

    const amount = ref(5);
    const randomImages = ref([]);
    const dialogVisible = ref(false);

    const layout = ref('grid');
    const options = ref(['list', 'grid']);

    const getRandomImages = () => {
        const shuffledImages = props.images
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        randomImages.value = shuffledImages.slice(0, amount.value);

        dialogVisible.value = true;
    };

</script>

<template>
    <InputNumber v-model="amount" />
    <Button severity="secondary" label="Get Random amount" @click="getRandomImages()" />

    <Dialog v-model:visible="dialogVisible" modal>
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <span class="font-bold whitespace-nowrap">Random {{ amount }} images</span>
                <Button severity="secondary" label="Roll again" @click="getRandomImages()" />
            </div>
        </template>
        <div class="flex items-center gap-4 mb-4">
            <div class="card">
                <DataView :value="randomImages" :layout="layout" paginator :rows="10">
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
        </div>
        <template #footer>
            <Button label="Cancel" text severity="secondary" @click="dialogVisible = false" autofocus />
        </template>
    </Dialog>
</template>