import {ref} from "vue";

export const initCircleOption = (color,scale)=>{
    return {
        drawingMode: null,
        drawingControl: false,
        circleOptions: {
            editable: false,
            draggable: false,
            optimized: false,
            strokeColor: color,
            strokeWeight: scale,
            fillOpacity: 0,
        },
    }
}
const highlightedOption = (e)=>{
    return {
        strokeOpacity: 1.0,
        strokeWeight: e.overlay.strokeWeight*2
    }
}

const originalOption = (e)=>{
    return {
        strokeColor: e.overlay.strokeColor,
        strokeOpacity: e.overlay.strokeOpacity,
        strokeWeight: e.overlay.strokeWeight
    }
}
const attrList = ref([]);
const selectedLayer = ref([]);
export const circleOverLayCompleteOptions = async (e, map, scale, color,store) => {

    e.overlay.properties = [];
    console.log("circle ",e);


    attrList.value = [{parentID:e.overlay.id,attribute:'radius length',value:e.overlay.getRadius().toFixed(2)+' m'}];
    e.overlay.properties = attrList.value;
    selectedLayer.value = e.overlay;
    //-------------------creating google mp feature for map data layer (later this will save as json)---
    let feature = new google.maps.Data.Feature({
        properties: {fillColor: e.overlay.get('fillColor'),strokeWeight: e.overlay.get('strokeWeight'), radius: e.overlay.getRadius()},
        geometry: new google.maps.Data.Point(e.overlay.getCenter()),
        id:e.overlay.id
    });

    //-------------------------------------adding layer to map------------------------------------------
    map.data.add(feature);
    //-----------------hiding feature.because it is overlapping the layer-------------------------------
    map.data.overrideStyle(feature, {visible: false,});

        //-----------------------------------click listener for save layer----------------------------------
        google.maps.event.addListener(e.overlay, 'click', function () {

            // Restore the previously selected circle's original options if available
            if (selectedLayer.value) {
                selectedLayer.value.setOptions(selectedLayer.value.originalOptions);
            }

            selectedLayer.value = e.overlay;
            let highlightOptions = highlightedOption(e);
            // let layerDataset = _.find(layerList.value, {'id': e.overlay.id});
            // attrList.value = layerDataset.properties;

            // Store the original options of the current circle
            e.overlay.originalOptions = originalOption(e);

            // Apply the highlight options to the circle
            e.overlay.setOptions(highlightOptions);
            store.commit('setTriggeredDrawingCircle',selectedLayer.value)
        });



    return { selectedLayer, attrList };
};


