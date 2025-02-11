<script setup>
    import FolderTree from './FolderTree.vue';
    import Card from 'primevue/card';

    defineProps({
        fileData: {
            type: Array,
            default: () => [],
        },
        SelectionMode: {
            type: String,
            default: "single",
        }
    });

    const emit = defineEmits(['nodeSelect', 'nodeUnselect']);
</script>

<template>
    <Card>
      <template #title>Ref Images</template>
      <template #content>
        <FolderTree 
            v-bind:file-data="fileData" 
            v-bind:selection-mode="SelectionMode"
            v-on:node-select="(node) => emit('nodeSelect', node)" 
            v-on:node-unselect="(node) => emit('nodeUnselect', node)"
        />
      </template>
    </Card>
</template>