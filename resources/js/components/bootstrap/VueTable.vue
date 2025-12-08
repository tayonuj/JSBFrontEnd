<template>
  <vue-table-lite :class="['vue-table', customClass]" :style="customStyle"
                  :is-static-mode="true"
                  :columns="headers"
                  :rows="data"
                  :page-options="pageOptions"
                  :total="data.length"
                  :is-slot-mode="true"
  >
  </vue-table-lite>

</template>
<script setup>

import VueTableLite from "vue3-table-lite";

const props = defineProps({
  customClass: {
    type: String,
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({})
  },
  data: {type:Array,default:[]},
  loading: {type:Boolean,default:false},
  headers:Array,
  pageOptions:{
    type:Object,
    default:[ { value: 10, text: 10 }]
  },

});

</script>
<style scoped>
</style>
