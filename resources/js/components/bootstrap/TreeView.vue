<template>
  <ul class="mb-0 treeview treeview-stripe" data-options='{"striped":true}'>
    <li v-for="(node, index) in filteredNodes" :key="index" class="treeview-list-item">

    <div @click="toggle(node)" class="tree-node">
        <span v-if="node.children && node.children.length">
          <i :class="isOpen(node) ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'" class="icon-spacing"></i>
          <i :class="isOpen(node) ? 'fa-solid fa-folder-open' : 'fa-solid fa-folder'" class="icon-spacing"></i>
          {{ node.label }}
        </span>
        <span v-if="node.children && node.children.length" class="toggle-icon">
          {{ isOpen(node) ? '-' : '+' }}
        </span>
      </div>
      <!-- Render child nodes if the parent is open -->
      <TreeView v-if="isOpen(node) && node.children && node.children.length" :nodes="node.children" />
      <br v-if="isOpen(node) && node.children && node.children.length">
      <!-- Render checkboxes for last children on a single line -->
      <div v-if="isOpen(node) && node.children && node.children.length && node.children.every(child => !child.children)" class="checkbox-container">
        <label v-for="(child, idx) in node.children" :key="idx">
          <input type="checkbox" :id="`${index}-${child.label}`" :name="`${node.label}`"  :value="`${child.label}`" v-model="selectedValues" />
          {{`${child.label}`}}
        </label>

      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  nodes: {
    type: Array,
    required: true,
  },
});

const openNodes = ref(new Set());
const selectedValues = ref([]);

const toggle = (node) => {
  if (openNodes.value.has(node)) {
    openNodes.value.delete(node);
  } else {
    openNodes.value.add(node);
  }
};

const isOpen = (node) => {
  return openNodes.value.has(node);
};
// Computed property to filter nodes with children
const filteredNodes = computed(() => {
  return props.nodes.filter(node => node.children && node.children.length);
});
</script>

<style scoped>
/* Styles for the striped tree view */
.treeview-stripe li:nth-child(odd) {
  background-color: #f9f9f9;
}

.treeview-stripe li {
  padding: 5px 10px;
}

.tree-node {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
}

ul {
  list-style-type: none;
  padding-left: 20px;
}

.toggle-icon {
  margin-left: 10px;
}

.checkbox-container {
  padding-left: 20px;
  display: flex;
  flex-wrap: wrap;
}

.checkbox-container label {
  margin-right: 10px;
}
.icon-spacing {
  margin-right: 5px;
}

.node-label {
  flex-grow: 1;
}

.toggle-icon {
  display: flex;
  gap: 5px;
}

ul {
  list-style-type: none;
  padding-left: 20px;
}


</style>
