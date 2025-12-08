import {ref} from "vue";

export const initPolygonOption = (color,scale)=>{
    return {
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
            editable: false,
            draggable: false,
            optimized: false,
            strokeColor: color,
            strokeWeight: scale
        },
    }
}
const highlightedOption = (e)=>{
    if (e.overlay.polygonOptions) {
        return {
            strokeOpacity: 1.0,
            strokeWeight: e.overlay.polygonOptions.strokeWeight * 2
        }
    }else{
        return {
            strokeOpacity: 1.0,
            strokeWeight: e.overlay.strokeWeight * 2
        }
    }
}

const originalOption = (e)=>{
    if (e.overlay.polygonOptions) {
        return {
            strokeColor: e.overlay.polygonOptions.strokeColor,
            strokeOpacity: e.overlay.polygonOptions.strokeOpacity,
            strokeWeight: e.overlay.polygonOptions.strokeWeight
        }
    }else{
        return {
            strokeColor: e.overlay.strokeColor,
            strokeOpacity: e.overlay.strokeOpacity,
            strokeWeight: e.overlay.strokeWeight
        }
    }
}
const attrList = ref([]);
const selectedLayer = ref([]);
export const polygonOverLayCompleteOptions = async (e, map, scale, color,store) => {

    e.overlay.properties = [];
    console.log("polygon ",e);


    let area = google.maps.geometry.spherical.computeArea(e.overlay.getPath().getArray());
    // let area = Math.round(areacal / 1000, 3)


    attrList.value = [{parentID:e.overlay.id,attribute:'area',value:area.toFixed(2)+' ㎡'}];
    e.overlay.properties = attrList.value;
    selectedLayer.value = e.overlay;
    //-------------------creating google mp feature for map data layer (later this will save as json)---
    let feature = new google.maps.Data.Feature({
        properties: {fillColor: e.overlay.get('fillColor'),strokeWeight: e.overlay.get('strokeWeight')},
        geometry: new google.maps.Data.Polygon([e.overlay.getPath().getArray()]),
        id:e.overlay.id
    });

    //-------------------------------------adding layer to map------------------------------------------
    map.data.add(feature);
    //-----------------hiding feature.because it is overlapping the layer-------------------------------
    map.data.overrideStyle(feature, {visible: false,});

        //-----------------------------------click listener for save layer----------------------------------
        google.maps.event.addListener(e.overlay, 'click', function () {

            // Restore the previously selected polygon's original options if available
            if (selectedLayer.value) {
                selectedLayer.value.setOptions(selectedLayer.value.originalOptions);
            }

            selectedLayer.value = e.overlay;
            console.log("fucking selected layer ",selectedLayer.value)
            let highlightOptions = highlightedOption(e);
            // let layerDataset = _.find(layerList.value, {'id': e.overlay.id});
            // attrList.value = layerDataset.properties;

            // Store the original options of the current polygon
            e.overlay.originalOptions = originalOption(e);

            // Apply the highlight options to the polygon
            e.overlay.setOptions(highlightOptions);
            store.commit('setTriggeredDrawingPolygon',selectedLayer.value)
        });



    return { selectedLayer, attrList };
};


