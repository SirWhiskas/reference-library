<script setup>
import { ref } from 'vue'

import Tree from 'primevue/tree'

defineProps({
  fileData: {
    type: Array,
    default: () => [],
  },
  selectionMode: {
    type: String,
    default: "single",
  }
})

const emit = defineEmits(['nodeSelect', 'nodeUnselect'])

const selectedKey = ref(null)

const onNodeSelect = (node) => {
  emit('nodeSelect', node)
}

const onNodeUnselect = (node) => {
  emit('nodeUnselect', node)
}
</script>

<template>
  <Tree
    v-model:selectionKeys="selectedKey"
    :value="fileData"
    :selectionMode="selectionMode"
    @nodeSelect="onNodeSelect"
    @nodeUnselect="onNodeUnselect"
  />
</template>
>
