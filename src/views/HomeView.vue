<script setup>
import { ref, onMounted, useTemplateRef } from 'vue'

import RefImageTree from '@/components/RefImageTree.vue'
import RefImageGallery from '@/components/RefImageGallery.vue'
import RefImageTiles from '@/components/RefImageTiles.vue';
import WarmUp from '@/components/WarmUp.vue';
import GestureTimer from '@/components/GestureTimer.vue';

import ScrollPanel from 'primevue/scrollpanel';
import Toast from 'primevue/toast';


import { useGetImageData, useGetImagePath } from '@/composables/images/useImageData'
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const images = ref([]);
const imageGallery = ref([]);
const selectedImage = ref(null);
const imagesForTiles = ref([]);
const timerValue = ref(120);

const galleryComponent = useTemplateRef("image-gallery");
const gestureTimerComponent = useTemplateRef("gesture-timer");

const shuffleArray = (array) => {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

const imageByKey = (imageArray, key) => {
  return imageArray.flatMap((obj) => {
    // If the current object's key matches, return it
    if (obj.key === key) {
      return { ...obj, children: obj.children || [] };
    }

    // Otherwise, check children recursively
    return obj.children ? imageByKey(obj.children, key) : [];
  });
}

const getRandomImagesFromNode = (node) => {
  const imagesForGallery = [];
  node.children.forEach((child) => {
    if (child.children === undefined) {
      imagesForGallery.push({
        "itemImageSrc": useGetImagePath(child.path.replace(/\\/g, '/')),
        "thumbnailImageSrc": useGetImagePath(child.path.replace(/\\/g, '/')),
        "alt": child.data,
        "title": child.label
      });
    } else {
      imageGallery.value.push(getRandomImagesFromNode(child));
    }
  });

  const shuffledImages = shuffleArray(imagesForGallery);

  return shuffledImages;
}

const handleFileSelect = (node) => {
  const path = node.path;
  const formattedPath = path.replace(/\\/g, '/');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico'];

  if (node.children != undefined) {
    if (node.children.some(c => imageExtensions.some(i => c.path.toLowerCase().endsWith(i)))) {
      const top20Images = node.children.slice(0, 20);
      
      imagesForTiles.value = top20Images.map(c => ({
        "itemImageSrc": useGetImagePath(c.path.replace(/\\/g, '/')),
        "thumbnailImageSrc": useGetImagePath(c.path.replace(/\\/g, '/')),
        "alt": c.data,
        "title": c.label
      }));
    }
    // const shuffledImages = getRandomImagesFromNode(node);
    // const topImagesFromTheDeck = shuffledImages.slice(0, 5);

    // imageGallery.value = topImagesFromTheDeck;
    // galleryComponent.value.showGallery();
  } else {
    const singleFileForGallery = [{
      "itemImageSrc": useGetImagePath(formattedPath),
      "thumbnailImageSrc": useGetImagePath(formattedPath),
      "alt": node.data,
      "title": node.label
    }];

    imageGallery.value = singleFileForGallery;
    galleryComponent.value.showGallery();
  }
  
}

const handleWarmUpStart = (folderNodes) => {
  let galleryImages = [];
  folderNodes.forEach(node => {
    const originalNodeData = imageByKey(images.value, node.key);
    if (originalNodeData.length > 0) {
      const originalNode = originalNodeData[0]; // Get the top one TODO: Make a better method
      const imagesFromNode = getRandomImagesFromNode(originalNode);
      galleryImages = [...galleryImages, ...imagesFromNode];
    }
  });

  const shuffledImages = shuffleArray(galleryImages);
  const topImagesFromTheDeck = shuffledImages.slice(0, 5);

  //toast.add({ severity: 'success', summary: 'Warm-up started!', detail: 'About to show the images!', life: 3000 });
  setTimeout(() => {
    imageGallery.value = topImagesFromTheDeck;
    galleryComponent.value.showGallery();
    gestureTimerComponent.value.startTimer();
  }, 3000);
  
}

const handleTimerEnd = () => {
  toast.add({ severity: 'warn', summary: 'Times up!', detail: 'About to switch to the next image!', life: 3000 });
}

const handleTimerToastEnd = () => {
  galleryComponent.value.goToNextImage();
  gestureTimerComponent.value.startTimer();
}

onMounted(async () => {
  images.value = await useGetImageData()
})
</script>

<template>
  <main>
    <Toast v-on:life-end="handleTimerToastEnd" />

    <GestureTimer 
      ref="gesture-timer" 
      v-bind:time="timerValue"
      v-on:on-times-up="handleTimerEnd"
    />

    <RefImageGallery ref="image-gallery" v-bind:image-gallery="imageGallery" />

    <WarmUp v-on:on-warm-up-start="handleWarmUpStart" />

    <ScrollPanel style="width: 100%; height: 75vh;">
      <RefImageTree v-bind:file-data="images" v-on:node-select="(node) => handleFileSelect(node)" />
    </ScrollPanel>

    <RefImageTiles v-bind:images="imagesForTiles" />
  </main>
</template>
