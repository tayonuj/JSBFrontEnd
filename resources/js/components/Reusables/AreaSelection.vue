<template >
    <div>
        <div class="row mb-3">
            <label for="province" class="col-sm-4 col-form-label">Province</label>
            <div class="col-sm-8">
                <select class="form-select" id="province" title="All continents" v-model="province" @change="getArea('province',province,'district')">
                    <option v-for="map in province_list">{{map}}</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <label for="province" class="col-sm-4 col-form-label">District</label>
            <div class="col-sm-8">
                <select class="form-select" v-model="district" @change="getArea('district',district,'dsd')">
                    <option v-for="map in district_list">{{map}}</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <label for="province" class="col-sm-4 col-form-label">DSD</label>
            <div class="col-sm-8">
                <select class="form-select" v-model="dsd" @change="getArea('dsd',dsd,'gnd')">
                    <option v-for="map in dsd_list">{{map}}</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <label for="province" class="col-sm-4 col-form-label">GND</label>
            <div class="col-sm-8">
                <select class="form-select" v-model="gnd" @change="getArea('gnd',gnd,'asc')">
                    <option v-for="map in gnd_list">{{map}}</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <label for="province" class="col-sm-4 col-form-label">ASC</label>
            <div class="col-sm-8">
                <select class="form-select" v-model="asc" @change="getArea('asc',asc,'asc')">
                    <option v-for="map in asc_list">{{map}}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAccount } from '@mdi/js';
import {mapState, useStore} from "vuex";
import {inject, onMounted, ref, defineProps, watchEffect, defineEmits, toRaw} from "vue";
import generalAxiosRequest from "../../composables/application/generalAxiosRequest";
import loadArea from "../../composables/layers/loadArea";

const emits = defineEmits(['update', 'areaLoaded']);

const props = defineProps({
    initialProvince: String,
    initialDistrict: [Array, String],
    initialDSD: [Array, String],
    initialGND: [Array, String],
    initialASC: [Array, String],
    initialDistrictList: [Array, String],
    initialDSDList: [Array, String],
    initialGNDList: [Array, String],
    initialASCList: [Array, String],
    boundaryLevel: Number,
    multipleBoundary:Boolean
});
const province = ref(props.initialProvince);
const district = ref(props.initialDistrict);
const dsd = ref(props.initialDSD);
const gnd = ref(props.initialGND);
const asc = ref(props.initialASC);
let cascade = ref("");

let asc_list = ref([]);
// let province_list = ref(["CENTRAL", "EASTERN", "NORTH CENTRAL", "NORTH WESTERN", "NORTHERN", "SABARAGAMUWA", "SOUTHERN", "UVA", "WESTERN"]);
let province_list = ref(["EASTERN", "NORTH CENTRAL", "NORTH WESTERN", "NORTHERN"]);
let district_list = ref([]);
let dsd_list = ref([]);
let gnd_list = ref([]);
let cascade_list = ref([]);
let selected_boundary_type = ref("");
let selected_boundary_value = ref("");
let requested_boundary_type = ref("");
let requested_boundary_values = ref([]);

watchEffect(() => {
    // If the props change from the parent component, update local refs
    province.value = props.initialProvince;
    district.value = props.initialDistrict;
    dsd.value = props.initialDSD;
    gnd.value = props.initialGND;
    district_list.value = props.initialDistrictList;
    dsd_list.value = props.initialDSDList;
    gnd_list.value = props.initialGNDList;
    asc_list.value = props.initialASCList;
});



const store = useStore()
const googleProperty = inject('$googleProperty')
const $loading =  inject('$loading')
const loading = ref({
    province:false,
    district:false,
    dsd:false,
    gnd:false,
    asc:false,
    Cascade:false,
    River_basin:false,
})
const getArea = async (existing_level, selected_value, requesting_level) => {
    if (selected_value && selected_value.toString() !== '') {
        let data = await loadArea(existing_level, selected_value, requesting_level, $loading);
        data = toRaw(data);
        console.log("fucking data",data);
        selected_boundary_type.value = data.selected_boundary_type;
        selected_boundary_value.value = data.selected_boundary_value;
        requested_boundary_type.value = data.requested_boundary_type;

        if (data.province_list) {
            dsd.value = "";
            gnd.value = "";
            province_list.value = data.province_list;
        }
        if (data.district_list) {
            dsd.value = "";
            gnd.value = "";
            district_list.value = data.district_list;
        }
        if (data.dsd_list) {
            gnd.value = "";
            dsd_list.value = data.dsd_list;
        }
        if (data.gnd_list) {
            gnd_list.value = data.gnd_list;
        }
        if (data.asc_list) {
            asc_list.value = data.asc_list;
        }
        requested_boundary_values.value = data.requested_boundary_values;
        // Emit event to parent component with new data

        emits('update', {
            province: province.value,
            district: district.value,
            dsd: dsd.value,
            gnd: gnd.value,
            selected_boundary_type: selected_boundary_type.value,
            selected_boundary_value: selected_boundary_value.value,
            requested_boundary_type: requested_boundary_type.value,
            requested_boundary_values: requested_boundary_values.value,
            district_list: district_list.value,
            dsd_list: dsd_list.value,
            gnd_list: gnd_list.value,
            asc_list: asc_list.value,
        });

        emits('areaLoaded', true);
    }
};




// onMounted(async () => {
//     await getArea("province", "All", "province");
// })


</script>
