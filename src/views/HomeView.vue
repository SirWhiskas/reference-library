<script setup>
import { ref, onMounted, useTemplateRef } from 'vue'

import RefImageGallery from '@/components/RefImageGallery.vue'
import RefImageTiles from '@/components/RefImageTiles.vue'
import WarmUp from '@/components/WarmUp.vue'
import GestureTimer from '@/components/GestureTimer.vue'
import LotteryTiles from '@/components/LotteryTiles.vue'
import FolderTree from '@/components/FolderTree.vue'

import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

import { useGetImageData, useGetImagePath } from '@/composables/images/useImageData'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const images = ref([])
const imageGallery = ref([])
const imagesForTiles = ref([])
const timerValue = ref(120)
const hasCompletedWarmUp = ref(false)
const sidebarVisible = ref(false)
const selectedFolderName = ref('')

const galleryComponent = useTemplateRef('image-gallery')
const gestureTimerComponent = useTemplateRef('gesture-timer')

const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

const imageByKey = (imageArray, key) => {
  return imageArray.flatMap((obj) => {
    if (obj.key === key) {
      return { ...obj, children: obj.children || [] }
    }
    return obj.children ? imageByKey(obj.children, key) : []
  })
}

const getRandomImagesFromNode = (node) => {
  const imagesForGallery = []
  node.children.forEach((child) => {
    if (child.children === undefined) {
      imagesForGallery.push({
        itemImageSrc: useGetImagePath(child.path.replace(/\\/g, '/')),
        thumbnailImageSrc: useGetImagePath(child.path.replace(/\\/g, '/')),
        alt: child.data,
        title: child.label,
      })
    } else {
      imagesForGallery.push(...getRandomImagesFromNode(child))
    }
  })
  return shuffleArray(imagesForGallery)
}

const handleFileSelect = (node) => {
  const path = node.path
  const formattedPath = path.replace(/\\/g, '/')
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico']

  selectedFolderName.value = node.label
  sidebarVisible.value = false

  if (node.children != undefined) {
    if (node.children.some((c) => imageExtensions.some((i) => c.path.toLowerCase().endsWith(i)))) {
      imagesForTiles.value = node.children.map((c) => ({
        itemImageSrc: useGetImagePath(c.path.replace(/\\/g, '/')),
        thumbnailImageSrc: useGetImagePath(c.path.replace(/\\/g, '/')),
        alt: c.data,
        title: c.label,
      }))
    }
  } else {
    imageGallery.value = [
      {
        itemImageSrc: useGetImagePath(formattedPath),
        thumbnailImageSrc: useGetImagePath(formattedPath),
        alt: node.data,
        title: node.label,
      },
    ]
    galleryComponent.value?.showGallery()
  }
}

const handleWarmUpStart = (folderNodes) => {
  hasCompletedWarmUp.value = false

  let galleryImages = []
  folderNodes.forEach((node) => {
    const originalNodeData = imageByKey(images.value, node.key)
    if (originalNodeData.length > 0) {
      const imagesFromNode = getRandomImagesFromNode(originalNodeData[0])
      galleryImages = [...galleryImages, ...imagesFromNode]
    }
  })

  const topImagesFromTheDeck = shuffleArray(galleryImages).slice(0, 5)

  setTimeout(() => {
    imageGallery.value = topImagesFromTheDeck
    galleryComponent.value?.showGallery()
    gestureTimerComponent.value?.startTimer()
  }, 3000)
}

const handleWarmUpEnd = () => {
  toast.add({
    severity: 'success',
    summary: 'Warm-up ended!',
    detail: 'Congrats! You did it!',
    life: 3000,
  })
  galleryComponent.value.hideGallery()
  gestureTimerComponent.value.stopTimer()
}

const handleGalleryEnd = () => {
  hasCompletedWarmUp.value = true
}

const handleTimerEnd = () => {
  if (!hasCompletedWarmUp.value) {
    toast.add({
      severity: 'warn',
      summary: 'Times up!',
      detail: 'About to switch to the next image!',
      life: 3000,
    })
  } else {
    handleWarmUpEnd()
  }
}

const handleQuickWarmUp = () => {
  if (imagesForTiles.value.length === 0) return
  hasCompletedWarmUp.value = false

  const topImages = shuffleArray(imagesForTiles.value).slice(0, 5)

  setTimeout(() => {
    imageGallery.value = topImages
    galleryComponent.value?.showGallery()
    gestureTimerComponent.value?.startTimer()
  }, 3000)
}

const handleTimerToastEnd = () => {
  if (!hasCompletedWarmUp.value) {
    galleryComponent.value?.goToNextImage()
    gestureTimerComponent.value?.startTimer()
  }
}

onMounted(async () => {
  images.value = await useGetImageData()
})
</script>

<template>
  <div class="flex flex-col h-dvh overflow-hidden bg-surface-50 dark:bg-surface-900">
    <Toast group="timer" v-on:life-end="handleTimerToastEnd" />
    <Toast />
    <GestureTimer ref="gesture-timer" v-bind:time="timerValue" v-on:on-times-up="handleTimerEnd" />
    <RefImageGallery
      ref="image-gallery"
      v-bind:image-gallery="imageGallery"
      v-on:on-gallery-end="handleGalleryEnd"
    />

    <!-- App header bar -->
    <header
      class="flex items-center gap-2 px-3 py-2 bg-surface-0 dark:bg-surface-950 border-b border-surface-200 dark:border-surface-700 shrink-0 z-10 shadow-sm"
    >
      <div class="lg:hidden shrink-0">
        <Button
          icon="pi pi-bars"
          text
          rounded
          size="small"
          class="-ml-1"
          aria-label="Toggle folder sidebar"
          @click="sidebarVisible = true"
        />
      </div>
      <div class="flex items-center gap-2 min-w-0 mr-auto">
        <i class="pi pi-images text-primary-400 text-lg shrink-0 hidden sm:block" />
        <span class="font-semibold text-base truncate">Ref Library</span>
        <span
          v-if="selectedFolderName"
          class="text-surface-400 dark:text-surface-500 text-sm truncate hidden sm:inline"
        >
          / {{ selectedFolderName }}
        </span>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <WarmUp v-on:on-warm-up-start="handleWarmUpStart" />
        <LotteryTiles v-bind:images="imagesForTiles" />
      </div>
    </header>

    <!-- Main layout: sidebar + content -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Desktop sidebar -->
      <nav
        class="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 border-r border-surface-200 dark:border-surface-700 overflow-y-auto bg-surface-0 dark:bg-surface-950"
      >
        <div
          class="flex items-center gap-2 px-3 py-3 border-b border-surface-100 dark:border-surface-800 sticky top-0 bg-surface-0 dark:bg-surface-950 z-10"
        >
          <i class="pi pi-folder text-primary-400" />
          <span class="font-medium text-sm text-surface-600 dark:text-surface-400 uppercase tracking-wide">
            Folders
          </span>
        </div>
        <FolderTree v-bind:file-data="images" v-on:node-select="handleFileSelect" />
      </nav>

      <!-- Mobile drawer -->
      <Drawer v-model:visible="sidebarVisible" position="left" style="width: 18rem">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-images text-primary-400" />
            <span class="font-semibold">Ref Images</span>
          </div>
        </template>
        <FolderTree v-bind:file-data="images" v-on:node-select="handleFileSelect" />
      </Drawer>

      <!-- Image content area -->
      <main class="flex-1 overflow-y-auto">
        <div
          v-if="imagesForTiles.length === 0"
          class="flex flex-col items-center justify-center h-full gap-3 text-surface-300 dark:text-surface-600 select-none"
        >
          <i class="pi pi-folder-open" style="font-size: 4rem" />
          <p class="text-base font-medium">Select a folder to view images</p>
        </div>
        <RefImageTiles v-else v-bind:images="imagesForTiles" @quick-warm-up="handleQuickWarmUp" />
      </main>

    </div>
  </div>
</template>
