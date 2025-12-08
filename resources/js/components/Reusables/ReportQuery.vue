<template>
    <div class="row mb-5">
        <div class="col-md-3">
            <label for="filterAttr" class="form-label">Column</label>
            <select class="form-select" id="filterAttr" title="All continents" v-model="selectedAttribute" @change="setSelectedAttrValues()">
                <option v-for="attr in attribute_list">{{attr}}</option>
            </select>
        </div>
        <div class="col-md-3">
            <label for="filterLogic" class="form-label">Operator</label>
            <select class="form-select" id="filterLogic" title="All continents" v-model="dataOperator">
                <option selected>=</option>
                <option><</option>
                <option>></option>
                <option>≠</option>
            </select>
        </div>
        <div class="col-md-3">
            <label for="filterSelectedAttr" class="form-label">Value</label>
            <div v-if="isDateAttribute">
                <Datepicker         ignore-time-validation
                                    v-model="selectedDateRange" range placeholder="Select date range..." />
            </div>
            <div v-else>
                <Typeahead id="filterSelectedAttr"
                           :items="selectedAttrValues"
                           v-model="selectedAttrVal"
                           :minInputLength="0"
                           @selectItem="setAttrSelect"
                ></Typeahead>
            </div>
        </div>

        <div class="col-md-3">
            <button type="button" class="btn btn btn-falcon-primary me-1 mb-1 btn-sm" @click="applyQuery" style="margin-top: 32px">
                Query
                <i class="bi bi-funnel-fill"></i>
            </button>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {filterSwitch, groupedAttrValues} from "../../composables/layers/defaultQuery";
import Typeahead from "../plugins/Typeahead.vue";

const props = defineProps({
    attribute_list: Array,
    dataset: Array
});
const emits = defineEmits(['applyFilter']);

const selectedAttribute = ref("");
const dataOperator = ref("=");
const selectedAttrValues = ref([]);
const selectedAttrVal = ref("");
const selectedDateRange = ref(null);

const isDateAttribute = computed(() => selectedAttribute.value.toLowerCase().includes('date'));

const setSelectedAttrValues = () => {
    selectedAttrValues.value = groupedAttrValues(props.dataset, 'point', selectedAttribute.value, null);
};

const setAttrSelect = (data) => {
    selectedAttrVal.value = data;
};

const applyQuery = () => {
    let filteredData;
    if (isDateAttribute.value) {
        filteredData = filterSwitch(props.dataset, selectedAttribute.value, dataOperator.value, selectedDateRange.value);
    } else {
        filteredData = filterSwitch(props.dataset, selectedAttribute.value, dataOperator.value, selectedAttrVal.value);
    }
    console.log("filtered data", filteredData);
    emits('applyFilter', filteredData);
};
</script>



<style scoped>

</style>
