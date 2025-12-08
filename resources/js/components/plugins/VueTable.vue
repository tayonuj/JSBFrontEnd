<template>
  <div>
    <ReportQuery
        v-if="enableQuery"
        :attribute_list="attributes"
        :dataset="allData"
        @apply-filter="applyFilter"
    />

    <EasyDataTable
        :fixed-checkbox="false"
        :checkbox-column-width="0"
        :headers="headersWithCheckbox"
        :items="filteredData"
        :rows-per-page="rowsPerPage"
        table-class-name="customize-table"
        theme-color="#1D90FF"
        v-model:items-selected="itemsSelected"
        @update:items-selected="handleSelectionChange"
    >


      <template #item-emp_image="item">
        <img class="img-fluid rounded-3"
             :src="`http://hris.slpa.lk/EHRM_SLPA/EmpImages/${item.EMP_NUMBER}.JPG`"
             alt="" />

      </template>

      <template #item-status="item">
        <span class="badge rounded-pill" v-bind:class="getBadgeClass(item.STATUS)">
          {{item.STATUS}}
        </span>


      </template>

      <template #item-action_details="item">
        <button type="button"  class="btn btn-primary btn-sm" @click="showDetailModal(tableID,item)">
          <span class="fas fa-info me-1" data-fa-transform="shrink-3"></span>
        </button>
      </template>
      <template #item-action_new_page="item">
        <RouterLink class="nav-link" :to="`/employee-profile/${item.EMP_NUMBER}`" target="_blank">
          <div class="d-flex align-items-center">
            <span class="fas fa-info me-1" data-fa-transform="shrink-3"></span>
          </div>
        </RouterLink>
      </template>
    </EasyDataTable>
  </div>


</template>
<script setup>

import VueTableLite from "vue3-table-lite";
import {ref, computed, watch, onMounted} from "vue";
import ReportQuery from "../Reusables/ReportQuery.vue";

const props = defineProps({
  customClass: {
    type: String,
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default:[]
       },
  headers:{
    type:Array,
    default:[]
  },
  rowsPerPage:{
    type:Number,
    default:10,
  },
  enableCheckbox:{
    type:Boolean,default:false
  },
  enableQuery:{
    type:Boolean,default:true
  },
  tableID:{
    type:String,default:"default"
  },
});

const itemsSelected = ref([]);

const emits = defineEmits(['select-all','show-modal']);


// Add a computed property for headers to conditionally include the checkbox column
const headersWithCheckbox = computed(() => {
  if (props.enableCheckbox) {
    return [
      ...props.headers
    ];
  }
  else {
    return props.headers.filter(header => header.value !== 'checkbox');
  }
});

// Handle selection change
const handleSelectionChange = (selectedItems) => {
  itemsSelected.value = selectedItems;

    emits('select-all', selectedItems);
};

const showDetailModal = (tblID,dataset) => {
  let payload = {tblID:tblID,dataset:dataset}
    console.log("opening modal "+tblID,dataset)
    emits('show-modal', payload);
};

const showDetailPage = (tblID,dataset)=>{

}

watch(() => props.data, (data, oldEvent) => {
  if (data) {
    console.log("tbl dataset",data);
    getStats(data)
  }
});
const allData = ref([]);
const attributes = ref([]);
const filteredData = ref([]);
const getStats = (dataset) => {
  allData.value = dataset;
  filteredData.value = dataset;
  attributes.value  = _.map(props.headers,function (o) {
    if (o.value !== 'action_details')
      return o.value;
  });

  console.log("fucking attributed",attributes);
}

const applyFilter = (dataset) => {
  filteredData.value = dataset;
}

const getBadgeClass = (status) => {
  switch (status) {
    case 'Pending':return 'bg-primary';
    case 'Approved':return 'bg-success';
    case 'Rejected':return 'bg-danger';
    case 'Cancel_Pending':return 'bg-info';
    case 'Cancel_Approved':return 'bg-warning';
    case 'Cancelled':return 'bg-danger';
  }
}

onMounted(()=>{
  if (props.data){
    getStats(props.data)
  }
})
</script>
<style> .customize-table { --easy-table-border: 1px solid #D3D3D3; --easy-table-row-border: 1px solid #D3D3D3; --easy-table-header-font-size: 14px; --easy-table-header-height: 50px; --easy-table-header-font-color: #333; --easy-table-header-background-color: #F0F0F0; --easy-table-header-item-padding: 10px 15px; --easy-table-body-even-row-font-color: #333; --easy-table-body-even-row-background-color: #E7F3FF; --easy-table-body-row-font-color: #333; --easy-table-body-row-background-color: #fff; --easy-table-body-row-height: 50px; --easy-table-body-row-font-size: 14px; --easy-table-body-row-hover-font-color: #333; --easy-table-body-row-hover-background-color: #D6EAFF; --easy-table-body-item-padding: 10px 15px; --easy-table-footer-background-color: #F0F0F0; --easy-table-footer-font-color: #333; --easy-table-footer-font-size: 14px; --easy-table-footer-padding: 0px 10px; --easy-table-footer-height: 50px; --easy-table-scrollbar-track-color: #F0F0F0; --easy-table-scrollbar-color: #F0F0F0; --easy-table-scrollbar-thumb-color: #D6EAFF; --easy-table-scrollbar-corner-color: #F0F0F0; --easy-table-loading-mask-background-color: rgba(255, 255, 255, 0.8); /* Light blue shadow effect */ box-shadow: 0 4px 6px rgba(173, 216, 230, 0.6); } </style>
