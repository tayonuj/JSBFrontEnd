<template>

    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item me-1">
                <a :href="'#New'+spatialType" class="nav-link active" data-bs-toggle="tab">New Dataset</a>
            </li>
            <li class="nav-item me-1">
                <a :href="'#Saved'+spatialType" class="nav-link " data-bs-toggle="tab">Save Dataset</a>
            </li>
        </ul>
        <div class="tab-content pt-3">
            <div class="tab-pane fade show active" :id="'New'+spatialType">
                <div class="row gx-2">
                    <div class="col-6">
                        <button type="button"  @click="startDrawing" class="btn btn-outline-theme btn-sm ">Draw</button>
                        <button type="button" @click="deleteLayer" class="btn btn-outline-warning btn-sm ms-3">Clear</button>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-6">
                        <input type="text" class="form-control form-select-sm"  placeholder="Attribute" v-model="attr_name">
                    </div>
                    <div class="col-6">
                        <div class="input-group flex-nowrap">
                            <input type="text" class="form-control form-select-sm"  placeholder="Value" v-model="attr_value">
                            <button class="btn btn-secondary btn-sm" type="button" >
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <table v-if="layer && layer.id" class="table table-sm table-striped mt-2" >
                        <thead>
                        <tr>
                            <th>Attribute</th>
                            <th>Value</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,key) in selectedAttributes" :key="key">
                                <td>{{item.attribute}}</td>
                                <td>{{item.value}}</td>
                                <td>
                                    <button class="btn btn-danger btn-sm" type="button" >
                                        <i class="bi bi-archive"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                </table>
                <form class="needs-validation">
                    <div class="row mt-2">
                        <div class="col-6">
                            <input type="text" class="form-control form-select-sm"
                                   :class="!layerNameAvailable?'is-invalid':''"
                                   placeholder="Layer Name" v-model="layerName">
                            <div class="invalid-tooltip">Name is Already Exists!</div>
                        </div>
                        <div class="col-6">
                            <button type="button" class="btn btn-success btn-sm " @click="saveData"
                                    :class="!layerNameAvailable || layerList.length === 0 || !layerName ? 'disabled':''"
                                    :aria-disabled="!layerNameAvailable"
                            >Save</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="tab-pane fade" :id="'Saved'+spatialType">
                    <div class="list-group-item d-flex align-items-center mt-2" v-for="(item,key) in allLayersData">
                        <div class="align-items-center">
                            <div class="form-check">
                                <input class="form-check-input"
                                       v-model="item.visibility"
                                       type="checkbox"
                                       @change="setSelectedSavedLayer(item.name,item.visibility)"
                                >
                            </div>
                        </div>
                        <div class="flex-fill px-3">
                            <div class="fw-bold">{{ item.name }}</div>
                        </div>
                    </div>
            </div>
        </div>
    </div>

<!--    <v-row>-->
<!--        <v-col cols="12" sm="12" md="12" lg="12">-->
<!--            <v-tabs  fixed-tabs  class="custom_main_tab rounded-sm" v-model="tab_large" show-arrows>-->
<!--                <v-tab  class="custom_text_transform" density="compact">-->
<!--                        New dataset-->
<!--                </v-tab>-->
<!--                <v-tab class="custom_text_transform">-->
<!--                        Save dataset-->
<!--                </v-tab>-->
<!--            </v-tabs>-->

<!--            <v-window v-model="tab_large">-->
<!--                <v-window-item>-->
<!--                        <v-card-text>-->
<!--                            <v-row>-->
<!--                                <v-col cols="12" sm="12" md="12" lg="12">-->
<!--                                    <div>-->
<!--                                        <div>-->
<!--                                            <v-tabs v-model="tab_small" density="compact" class="rounded-sm"  show-arrows>-->
<!--                                                <v-tab  class="custom_text_transform">-->
<!--                                                        Draw-->
<!--                                                </v-tab>-->
<!--                                                <v-tab class="custom_text_transform">-->
<!--                                                        Style-->
<!--                                                </v-tab>-->
<!--                                            </v-tabs>-->

<!--                                            <v-window class="mt-3" v-model="tab_small">-->
<!--                                                <v-window-item>-->
<!--                                                    <v-row>-->
<!--                                                        <v-col cols="12" sm="12" md="12" lg="12">-->
<!--                                                            <v-row class="mt-2">-->
<!--                                                                <v-btn size="x-small" variant="text" border-->
<!--                                                                       @click="startDrawing"-->
<!--                                                                       class="custom_text_transform  ml-3">-->
<!--                                                                    Draw-->
<!--                                                                </v-btn>-->

<!--                                                                <v-btn size="x-small"-->
<!--                                                                       variant="text" border-->
<!--                                                                       class="custom_text_transform ml-3"-->
<!--                                                                       @click="deleteLayer()"-->
<!--                                                                >-->
<!--                                                                    Delete-->
<!--                                                                </v-btn>-->
<!--                                                            </v-row>-->

<!--                                                            <v-row v-if="layer && layer.id">-->
<!--                                                                <v-col cols="5">-->
<!--                                                                    <v-text-field v-model="attr_name" placeholder="Attribute"-->
<!--                                                                                  hide-details-->
<!--                                                                                  name="Attribute"  variant="outlined"-->
<!--                                                                                  color="#086EFF"-->
<!--                                                                                  density="compact"-->
<!--                                                                    ></v-text-field>-->
<!--                                                                </v-col>-->
<!--                                                                <v-col cols="6">-->
<!--                                                                    <v-text-field v-model="attr_value" placeholder="Value"-->
<!--                                                                                  hide-details-->
<!--                                                                                  name="Value"  variant="outlined"-->
<!--                                                                                  color="#086EFF" clearable-->
<!--                                                                                  density="compact"-->
<!--                                                                                  append-icon="mdi-plus-box"-->
<!--                                                                                  @click:append="addAttr"-->
<!--                                                                    ></v-text-field>-->
<!--                                                                </v-col>-->
<!--                                                            </v-row>-->

<!--                                                            <v-table v-if="layer && layer.id" density="compact" style="height: 200px;overflow-y: scroll;overflow-x: hidden">-->
<!--                                                                <template v-slot:default>-->
<!--                                                                    <thead class="custom_table_header_color">-->
<!--                                                                    <tr>-->
<!--                                                                        <th class="text-left">-->
<!--                                                                            Attribute-->
<!--                                                                        </th>-->
<!--                                                                        <th class="text-left">-->
<!--                                                                            Value-->
<!--                                                                        </th>-->
<!--                                                                        <th class="text-left">-->
<!--                                                                            Remove-->
<!--                                                                        </th>-->
<!--                                                                    </tr>-->
<!--                                                                    </thead>-->
<!--                                                                    <tbody>-->
<!--                                                                    <tr v-for="(item,key) in selectedAttributes" :key="key">-->
<!--                                                                        <td class="custom_table_text">{{item.attribute}}</td>-->
<!--                                                                        <td class="custom_table_text">{{item.value}}</td>-->
<!--                                                                        <td class="custom_table_text">-->
<!--                                                                            <v-btn variant="text" icon size="x-small" v-bind="props" @click="deleteAttr(item.parentID,key)">-->
<!--                                                                                <v-icon class="custom_btn_white_icon">mdi mdi-delete-alert</v-icon>-->
<!--                                                                            </v-btn>-->
<!--                                                                        </td>-->
<!--                                                                    </tr>-->
<!--                                                                    </tbody>-->
<!--                                                                </template>-->
<!--                                                            </v-table>-->
<!--                                                        </v-col>-->
<!--                                                    </v-row>-->

<!--                                                    <v-row>-->
<!--                                                        <v-col cols="12" sm="12" md="12" lg="12">-->
<!--                                                            <v-row>-->
<!--                                                                <v-col cols="10">-->
<!--                                                                    <v-text-field variant="outlined" color="#086EFF"-->
<!--                                                                                  hide-details-->
<!--                                                                                  clearable density="compact"-->
<!--                                                                                  placeholder="Layer Name"-->
<!--                                                                                  :rules="[() => !!layerNameAvailable || 'layer name already exists.try different']"-->
<!--                                                                                  v-model="layerName"-->
<!--                                                                    ></v-text-field>-->
<!--                                                                </v-col>-->
<!--                                                                <v-col cols="2">-->
<!--                                                                    <v-btn block variant="tonal" border-->
<!--                                                                           :loading="saveLoading"-->
<!--                                                                           class="custom_save_btn_for_tools custom_btn_gray_outlined custom_text_transform"-->
<!--                                                                           @click="saveData"-->
<!--                                                                    >-->
<!--                                                                        Save-->
<!--                                                                    </v-btn>-->
<!--                                                                </v-col>-->
<!--                                                            </v-row>-->
<!--                                                        </v-col>-->
<!--                                                    </v-row>-->
<!--                                                </v-window-item>-->

<!--                                                <v-window-item>-->
<!--                                                    <v-row>-->
<!--                                                        <v-col cols="12" xs="12" sm="12" md="12" lg="12">-->
<!--                                                            <v-color-picker dot-size="20" hide-inputs-->
<!--                                                                            v-model="color"-->
<!--                                                                            swatches-max-height="200"-->
<!--                                                                            width="100%"-->
<!--                                                            ></v-color-picker>-->
<!--                                                        </v-col>-->

<!--                                                        <v-col cols="12" sm="12" md="12" lg="12">-->
<!--                                                            <v-slider class="mt-4"  v-model="scale" color="#004EEB" label="Radius" thumb-label="always"></v-slider>-->
<!--                                                        </v-col>-->

<!--                                                        <v-col cols="12" sm="12" md="12" lg="12">-->
<!--                                                            <div class="float-right">-->
<!--                                                                <v-spacer></v-spacer>-->
<!--                                                                <v-btn @click="makeStyle" variant="tonal" border-->
<!--                                                                       class="ml-1 custom_btn_blue custom_text_transform" >-->
<!--                                                                    Apply-->
<!--                                                                </v-btn>-->
<!--                                                            </div>-->
<!--                                                        </v-col>-->
<!--                                                    </v-row>-->
<!--                                                </v-window-item>-->
<!--                                            </v-window>-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                </v-col>-->
<!--                            </v-row>-->
<!--                        </v-card-text>-->
<!--                </v-window-item>-->

<!--                <v-window-item>-->
<!--                    <v-card max-width="100%" >-->
<!--&lt;!&ndash;                            <div>&ndash;&gt;-->
<!--&lt;!&ndash;                                <v-row align="center" justify="center">&ndash;&gt;-->
<!--&lt;!&ndash;                                    <v-col cols="12" sm="12" md="12" lg="12">&ndash;&gt;-->
<!--&lt;!&ndash;                                            <v-select  variant="outlined" color="#086EFF"&ndash;&gt;-->
<!--&lt;!&ndash;                                                       style="z-index: 9999999"&ndash;&gt;-->
<!--&lt;!&ndash;                                                       clearable density="compact"&ndash;&gt;-->
<!--&lt;!&ndash;                                                       :items="allLayersList"&ndash;&gt;-->
<!--&lt;!&ndash;                                                       v-model="selectedLayerName"&ndash;&gt;-->
<!--&lt;!&ndash;                                                       @update:modelValue="setSelectedSavedLayer(selectedLayerName)"&ndash;&gt;-->
<!--&lt;!&ndash;                                                       placeholder="Layers">&ndash;&gt;-->
<!--&lt;!&ndash;                                            </v-select>&ndash;&gt;-->

<!--&lt;!&ndash;                                    </v-col>&ndash;&gt;-->
<!--&lt;!&ndash;                                </v-row>&ndash;&gt;-->
<!--&lt;!&ndash;                            </div>&ndash;&gt;-->



<!--                                <v-list density="compact" :lines="false" style="height: 250px;overflow-y: scroll" lines="one" height="30">-->
<!--                                          <v-list-item v-for="(item,key) in allLayersData" :key="key" :value="item.name" >-->
<!--                                              <template v-slot:prepend>-->
<!--                                                  <v-list-item-action start>-->
<!--                                                      <v-checkbox-btn-->
<!--                                                          density="compact"-->
<!--                                                          color="#004EEB"-->
<!--                                                          :model-value="false"-->
<!--                                                          v-model="item.visibility"-->
<!--                                                          :true-value="true" :false-value="false"-->
<!--                                                          @update:modelValue="setSelectedSavedLayer(item.name,$event)"-->
<!--                                                      ></v-checkbox-btn>-->
<!--                                                  </v-list-item-action>-->
<!--                                              </template>-->
<!--                                              <v-list-item-title>{{item.name}}</v-list-item-title>-->
<!--                                           </v-list-item>-->
<!--                                </v-list>-->

<!--                    </v-card>-->
<!--                </v-window-item>-->
<!--            </v-window>-->
<!--        </v-col>-->
<!--    </v-row>-->
</template>

<script setup>
import {defineProps, defineEmits, inject, getCurrentInstance, toRaw} from 'vue';
import {useStore} from "vuex";
import {computed, onMounted, ref, watch} from "vue";
import {initializeDrawingManager,handleOverlayComplete} from "../../composables/map/Drawings/TUJDrawingManager";
import saveDataLayer from "../../composables/map/Drawings/saveDataLayer";
import mapBounds from "../../composables/map/mapBounds";
import {initMarkerOption} from "../../composables/map/Drawings/Marker";
import {initPolylineOption} from "../../composables/map/Drawings/Polyline";
import {initPolygonOption} from "../../composables/map/Drawings/Polygon";
import {initCircleOption} from "../../composables/map/Drawings/Circle";
import {initRectangleOption} from "../../composables/map/Drawings/Rectangle";
import $ from 'jquery';

const props = defineProps({
    SpatialType: String,
});
const tab_large = ref(0);
const tab_small = ref(0);

const spatialType = props.SpatialType;



const store = useStore()
let drawingM = ref(null);
let layer = ref(null);
let layerList = ref([]);
let attributeList = ref([]);
let selectedAttributes = ref([]);

const initDrawing = ()=>{
    let map = store.state.gmap;
    const drawingManager = initializeDrawingManager(map,'Point');
    console.log("fucking drawing manager",drawingManager)
    drawingM.value = drawingManager.value;
    handleOverlayComplete(map, spatialType,store, ({ selectedLayer, attrList }) => {
        layer.value = selectedLayer.value;
        attributeList.value = _.concat(attrList.value,attributeList.value);
        selectedAttributes.value = attrList.value;
        console.log(drawingManager.value)
        layerList.value.push(layer.value)
        drawingM.value.setDrawingMode(null);
    })

}

const startDraw = ref(false);
const startDrawing = ()=>{
    let type = null;
    switch (spatialType) {
        case 'Point' : type = google.maps.drawing.OverlayType.MARKER;break;
        case 'polyline' : type = google.maps.drawing.OverlayType.POLYLINE;break;
        case 'polygon' : type = google.maps.drawing.OverlayType.POLYGON;break;
        case 'circle' : type = google.maps.drawing.OverlayType.CIRCLE;break;
        case 'rectangle' : type = google.maps.drawing.OverlayType.RECTANGLE;break;
    }
    drawingM.value.setDrawingMode(type);
    startDraw.value = true;
}

const gMap = computed(() => {
    return store.getters.gmap
})

// onMounted(async () => {
//     initDrawing()
// });
watch(gMap,function (newEvent,oldEvent) {
    if (newEvent){
        // alert(newEvent)
        initDrawing()
    }
});


const attr_name = ref("");
const attr_value = ref("");
const addAttr = ()=>{
    let parentID = layer.value.id;
    selectedAttributes.value.push({ parentID:parentID, attribute: attr_name.value, value: attr_value.value });
    attributeList.value.push({ parentID:parentID, attribute: attr_name.value, value: attr_value.value });
    attr_name.value = "";
    attr_value.value = "";
}
const deleteAttr = (id,key)=>{
    selectedAttributes.value.splice(key,1);
    let index = _.findIndex(attributeList.value,{parentID:id});
    if (index > -1){
        attributeList.value.splice(index,1);
    }
}

const triggeredSpatial = computed(() => {
    switch (spatialType) {
        case 'Point' :  return store.getters.triggeredDrawingMarker;
        case 'polyline' :  return store.getters.triggeredDrawingPolyline;
        case 'polygon' :  return store.getters.triggeredDrawingPolygon;
        case 'circle' :  return store.getters.triggeredDrawingCircle;
        case 'rectangle' :  return store.getters.triggeredDrawingRectangle;
    }

})

watch(triggeredSpatial,function (newEvent,oldEvent) {
    if (newEvent){
        console.log("marker clicked",newEvent);
        layer.value = newEvent;
        selectedAttributes.value = layer.value.properties;
    }
});

const deleteLayer = ()=>{
    toRaw(layer.value).setMap(null);
    layer.value = null;
    selectedAttributes.value = [];
}

let scale = ref(0.5)
let color = ref("#F00")

const makeStyle = () => {
    let option = null;
    switch (spatialType) {
        case 'Point' : option = initMarkerOption(color.value,scale.value)
                        break;
        case 'polyline' : option = initPolylineOption(color.value,scale.value)
                        break;
        case 'polygon' : option = initPolygonOption(color.value,scale.value)
                        break;
        case 'circle' : option = initCircleOption(color.value,scale.value)
                        break;
        case 'rectangle' : option = initRectangleOption(color.value,scale.value)
                        break;
    }
    console.log("fucking options",option);
    drawingM.value.setOptions(option);
}



const layerName = ref("");
const saveLoading = ref(false)
const {proxy} = getCurrentInstance();


const saveData = async () => {
    saveLoading.value = true;
    let map = store.state.gmap;
    const {savedList,savedData} = await saveDataLayer(map, layerList, layerName.value, spatialType);
    console.log("saved List",savedData);
    console.log("saved Data",savedList);
    allLayersList.value = savedList;
    allLayersData.value = savedData;
    saveLoading.value = false;
    deleteAllLayers();
    const confirmed = await proxy.$confirm({
        title: ' Refresh page?',
        message: 'To apply changes you need to refresh. continue?'
    });
    if (confirmed) {
        window.location.reload()
    }
    layerName.value = "";
}

const allLayersList = ref([]);
const allLayersData = ref([]);
const selectedLayerName = ref(null);
//----------------------------------------loading layers from back-end--------------------------------------
const loadLayerData = async () => {
    await axios.post('/api/v1/custom-layers/read', {type: spatialType}, {}).then(response => {
        console.log(response);
        // allLayersList.value = response.data.layer_list;
        allLayersData.value = _.map(response.data.layerSet,function (o) {
            o.visibility = false;
            return o;
        });
    });
}


onMounted(() => {
    loadLayerData();

})


const googleProperty = inject('$googleProperty')
const selectedLayerDataset = ref([]);
const circles = ref([]);
const setSelectedSavedLayer = (layer,visibility)=>{
    console.log("layer.....",visibility);
    let map = store.state.gmap;

    let getLayerDetails = _.find(allLayersData.value,{'name':layer});

    // $.each(that.selectedLayerDataset,function (key,val) {
    //     map.data.remove(val);
    // })
    let exists = _.find(selectedLayerDataset.value,{'name':layer});
    if (layer && !exists) {
        $.getJSON(getLayerDetails.url, function (data) {
            let features = map.data.addGeoJson(data);
            console.log(features);
           selectedLayerDataset.value.push({
                name:layer,
                features:features,
                visibility:true
            });
            let bounds = new google.maps.LatLngBounds();
            $.each(features, function (key, val) {

                    //-----------------styling the feature-------------------------------
                    map.data.overrideStyle(val, {
                        icon: val[googleProperty].icon,
                        strokeColor: val[googleProperty].strokeColor,
                        strokeWeight: val[googleProperty].strokeWidth,
                    });

                //-----------------------------Drawing circle according to geojson data----------------------------------
                var geo = val.getGeometry();
                //validating if the feature is point,radius and also needed to be visible and must not been initial yet
                if (geo.getType().toLowerCase() === 'point' && val.getProperty('radius')) {
                    //------------if this is not checked,map layer will be overlayed.
                    //create a new circle and put into circledata array (array using for multiple circles)
                    let circle =  new google.maps.Circle({
                        map: map,
                        id: val.getProperty('ID'),
                        center: geo.get(),
                        radius: val.getProperty('radius'),
                        fillOpacity: 0.5,
                        fillColor: val.getProperty('fillColor'),
                        strokeWeight: val.getProperty('strokeWeight')
                    });
                    circles.value.push(circle);
                }
                //-------------------applying click event listener----------------------------------------------
                map.data.addListener('click', function(event) {
                    console.log("map data clicked "+layer,val)
                    let properties = event.feature[googleProperty];
                    let result = _.omit(properties,['icon','strokeWeight','strokeColor','strokeWeight']);
                    if (properties.ID === val[googleProperty].ID)
                        store.commit('setInfoWindow',{lat:event.latLng.lat(),lng:event.latLng.lng(),data:result,key:result.keycount,type:'JSON File'});
                });
                mapBounds(val.getGeometry(), bounds.extend, bounds);
            });
            map.fitBounds(bounds);
        });

    }else{
        showHideLayer(visibility,layer);
    }
}

const layerNameAvailable = ref(true);
watch(layerName,function (data,oldEvent) {
    if (data){
        let exists = _.find( allLayersData.value,{'name':data});
        exists?layerNameAvailable.value = false:layerNameAvailable.value = true;
    }
});

const showHideLayer = (visibility,name)=>{
    console.log("set"+visibility,name);
    let layer = _.find(selectedLayerDataset.value,{'name':name});
    let map = store.state.gmap;
    if (layer) {
        if (visibility){

            $.each(layer.features, function (key, val) {
                console.log("fucking layer",val);
                //-----------------show the feature-------------------------------
                map.data.overrideStyle(val, {visible: true,});
                // val.setMap(map)
                let circle = _.find(circles.value,{'id':val[googleProperty].ID});
                if (circle)
                    circle.setMap(map);
            })
        }else{
            $.each(layer.features, function (key, val) {
                //-----------------show the feature-------------------------------
                map.data.overrideStyle(val, {visible: false,});
                // val.setMap(null)
                let circle = _.find(circles.value,{'id':val[googleProperty].ID});
                if (circle)
                    circle.setMap(null);
            })
        }
    }
}

const deleteAllLayers = ()=>{
    let map = store.state.gmap;
    console.log("fuck layerlist ",layerList.value)
    $.each(layerList.value,function (key,val) {
        val.setMap(null);
    });

    layerList.value = [];
    selectedAttributes.value = [];

}

</script>

<style scoped>
td {
    font-size: xx-small;
}
button{
    font-size: xx-small;
}
a{
    font-size: xx-small;
}
</style>
