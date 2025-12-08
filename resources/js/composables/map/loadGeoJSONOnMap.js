import {ref} from 'vue';
import _ from "lodash";
import {useStore} from "vuex";
import mapBounds from "./mapBounds";
import notificationHandling from "../application/notificationHandling";
import {useLoading} from "vue3-loading-overlay";
import {UJPointSymbol} from "./Drawings/MapElementDrawer";

/**
 * *Function is using for preview Feature collection JSON inside the Google map
 * JSON is treating as a Google map data
 * @param geoString {JSON} contains a feature collection JSON
 * @param layerName {String} is contain the layer name (we are treating the feature collection as a GIS Layer)
 * @param url {String} is contain the path of the layer (if just in case that we need to reload the layer from back-end)
 * @param map {Object} is contains the Google map object
 * @param googleProperty {String} this should be the key of the object , that we should be looking at the  Google map data
 * @param uniqueID {Number} this ID is used to identify the layer seperately from other layer.most of time it would be the length of the layers
 * @param store {Object} this is a store object that includes the vuex store to communicate using state management
 * @param color
 * @returns {{previewedLayer: Ref<UnwrapRef<{}>>}} returning the JSON object with layer details included on it
 * @author Tayon U J
 * @version 1.0.0
 */
const  loadGeoJSONOnMap =  (geoString,
                            layerName,url,
                            map,googleProperty,
                            uniqueID,store,color = '#F00',$loading,fillColor=null) => {
    const previewedLayer = ref({})
    const dataset = ref([]);
    let geojson = geoString;
    // let loader = useLoading();
    // if (allow_loading)
    //     loader.show();
    // const loader = $loading.show();
    const layer = ref(null);
    try {


        layer.value = new google.maps.Data();
        layer.value.addGeoJson(geojson);
        layer.value.setMap(map);
        // this.jsonDialog = false;
        let bounds = new google.maps.LatLngBounds();
        let keycount = 0;

        let attributes = [];
        let centerPoints = [];


        layer.value.forEach(function(feature) {
            // console.log("fucking layer",feature)
            //---------------------retrieving current object properties--------------------------------
            let objSet = feature[googleProperty];

            attributes =  Object.keys(objSet);
            //-------------------------------------pushing paths into properties-------------------------
            // objSet.paths = paths;
            objSet.key = keycount;
            objSet.layer = layerName;
            feature.layer = layerName;
            let opacity = isNaN(parseFloat(objSet.Opacity)) ? 0 : parseFloat(objSet.Opacity);
            if (fillColor){
                opacity = 0.6;
            }
            // setting up the styles

            if (feature.getGeometry().getType() === 'Point') {
                layer.value.overrideStyle(feature, {icon: UJPointSymbol(color,3.5)});
            }else{
                layer.value.overrideStyle(feature, {fillOpacity:opacity, strokeWeight: 1.1, strokeColor: color,fillColor: fillColor});
            }


            dataset.value.push(objSet);
            keycount++;
        });


        layer.value.forEach(function(feature) {
            //----------------------------setting map bounds------------------------------------------
            mapBounds(feature.getGeometry(), bounds.extend, bounds);
            var myLatlng = bounds.getCenter();
            centerPoints.push({
                dataset:feature[googleProperty],
                boundsCenter:{lat:myLatlng.lat(),lng:myLatlng.lng()},
                center:{lat:feature[googleProperty].lat,lng:feature[googleProperty].lng},
            });
            console.log("center",centerPoints);
        });

        map.fitBounds(bounds);

        console.log(layerName,dataset.value);

        layer.value.addListener('click', function(event) {

            let properties = event.feature[googleProperty];
            let result = _.omit(properties,['Shape_Leng','paths','path']);
            let payload = {
                lat : event.latLng.lat(),
                lng : event.latLng.lng(),
                address: "N/A"
            }
            store.commit('setMapLocation',payload);

            /**
             **this line will push the details to preview info window
             * to do that function use vuex
             * file is stored in store/index.js and trigger at Home.vue
             */

            store.commit('setInfoWindow',{lat:event.latLng.lat(),lng:event.latLng.lng(),data:result,key:result.keycount,type:'JSON File'});
        });


        previewedLayer.value = {
            url:url,
            name:layerName,
            data:layer.value,
            centerPoints:centerPoints,
            filteredData:layer.value,
            properties:dataset.value,
            attributes:attributes,
            id:uniqueID,
            data_id:uniqueID,
            queries:"",
            color:color,
            scale:4,
            visibility:true,
            buffer:null
        };
        // console.log("fucking loader",loader)
        // loader.hide();

    }catch (e) {
        notificationHandling("error",e.message)
        console.log(e);
        loader.hide();
    }

    return {previewedLayer}
}
export default loadGeoJSONOnMap;
