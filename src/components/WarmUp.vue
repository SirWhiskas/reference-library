<script setup>
import { ref, onMounted } from 'vue'

import RefImageTree from './RefImageTree.vue';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import Card from 'primevue/card';

import { useGetImageFolder } from '@/composables/images/useImageData';

const emit = defineEmits(['onWarmUpStart']);

const visible = ref(false);
const fileData = ref([]);
const foldersToUseForWarmUp = ref([]);

onMounted(async () => {
    fileData.value = await useGetImageFolder();
})

const handleNodeSelect = async (node) => {
  foldersToUseForWarmUp.value.push(node);
}

const handleNodeUnSelect = async (node) => {
  const index = foldersToUseForWarmUp.value.findIndex((folder) => folder.key === node.key);
  if (index !== -1) {
    foldersToUseForWarmUp.value.splice(index, 1);
  }
}
</script>

<template>
    <div>
        <Button label="Warm-up" icon="pi pi-stopwatch" size="small" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Edit Profile">
            <template #header>
                <div class="inline-flex items-center justify-center gap-2">
                    <span class="font-bold whitespace-nowrap">Select folders for warm-up</span>
                </div>
            </template>
            <div class="flex items-center gap-4 mb-4">
                <Card>
                    <template #content>
                        <ScrollPanel style="width: 100%; height: 60vh;">
                            <RefImageTree 
                                v-bind:file-data="fileData" 
                                :selection-mode="'checkbox'"
                                v-on:node-select="handleNodeSelect"
                                v-on:node-unselect="handleNodeUnSelect"
                            />
                        </ScrollPanel>
                    </template>
                </Card>
                
                <ScrollPanel style="width: 100%; height: 100%">
                    <ul>
                        <li v-for="folder in foldersToUseForWarmUp" :key="folder.key">
                            {{ folder.label }}
                        </li>
                    </ul>
                </ScrollPanel>
            </div>
            <template #footer>
                <Button label="Cancel" text severity="secondary" @click="visible = false" autofocus />
                <Button :disabled="foldersToUseForWarmUp.length === 0" label="Start Warm-up" outlined severity="secondary" @click="() => { visible = false; emit('onWarmUpStart', foldersToUseForWarmUp); }" autofocus />
            </template>
        </Dialog>
    </div>
</template>