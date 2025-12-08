<template>
  <li>
    <div class="treeview-item" @click="toggle" :class="{ 'has-children': hasChildren }">
      <span v-if="hasChildren" :class="isOpen ? 'icon-open' : 'icon-closed'"></span>
      {{ node.label }}
    </div>
    <ul v-if="hasChildren && isOpen" class="treeview-list">
      <TreeNode
          v-for="(child, index) in node.children"
          :key="index"
          :node="child"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'TreeNode',
  components: {
    TreeNode: () => import('../../bootstrap/TreeNode.vue'),
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length > 0;
    },
  },
  methods: {
    toggle() {
      if (this.hasChildren) {
        this.isOpen = !this.isOpen;
      }
    },
  },
};
</script>

<style scoped>
.treeview-item {
  cursor: pointer;
  padding-left: 20px;
  position: relative;
}

.has-children .icon-open::before {
  content: '▼';
  position: absolute;
  left: 0;
}

.has-children .icon-closed::before {
  content: '▶';
  position: absolute;
  left: 0;
}

.treeview-list {
  list-style-type: none;
  padding-left: 10px;
}
</style>
