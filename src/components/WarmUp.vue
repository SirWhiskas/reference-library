<script setup>
import { ref, onMounted } from 'vue'

import FolderTree from './FolderTree.vue'

import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import { useGetImageFolder } from '@/composables/images/useImageData'

const emit = defineEmits(['onWarmUpStart'])

const visible = ref(false)
const fileData = ref([])
const foldersToUseForWarmUp = ref([])

onMounted(async () => {
  fileData.value = await useGetImageFolder()
})

const handleNodeSelect = (node) => {
  foldersToUseForWarmUp.value.push(node)
}

const handleNodeUnSelect = (node) => {
  const index = foldersToUseForWarmUp.value.findIndex((f) => f.key === node.key)
  if (index !== -1) foldersToUseForWarmUp.value.splice(index, 1)
}
</script>

<template>
  <div>
    <Button label="Warm-up" icon="pi pi-stopwatch" size="small" @click="visible = true" />

    <Dialog v-model:visible="visible" modal style="width: min(95vw, 580px)">
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-stopwatch text-primary-400" />
          <span class="font-bold">Select folders for warm-up</span>
        </div>
      </template>

      <div class="flex flex-col gap-4">
        <!-- Folder tree -->
        <div
          class="border border-surface-200 dark:border-surface-700 rounded overflow-y-auto"
          style="max-height: 50vh"
        >
          <FolderTree
            :file-data="fileData"
            :selection-mode="'checkbox'"
            @node-select="handleNodeSelect"
            @node-unselect="handleNodeUnSelect"
          />
        </div>

        <!-- Selected folders -->
        <div>
          <p class="text-sm text-surface-400 mb-2">
            <span v-if="foldersToUseForWarmUp.length > 0">
              Selected ({{ foldersToUseForWarmUp.length }}):
            </span>
            <span v-else class="italic">No folders selected yet</span>
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="folder in foldersToUseForWarmUp"
              :key="folder.key"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
            >
              <i class="pi pi-folder text-xs" />
              {{ folder.label }}
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text severity="secondary" @click="visible = false" />
        <Button
          :disabled="foldersToUseForWarmUp.length === 0"
          label="Start Warm-up"
          icon="pi pi-play"
          @click="() => { visible = false; emit('onWarmUpStart', foldersToUseForWarmUp) }"
        />
      </template>
    </Dialog>
  </div>
</template>
