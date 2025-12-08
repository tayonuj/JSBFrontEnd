import {ref} from "vue";

export const initPolylineOption = (color,scale)=>{
    return {
        drawingMode: null,
        drawingControl: false,
        polylineOptions: {
            editable: false,
            draggable: false,
            optimized: false,
            strokeColor: color,
            strokeWeight: scale
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
export const polyLineOverLayCompleteOptions = async (e, map, scale, color,store) => {

    e.overlay.properties = [];
    console.log("polyline ",e);


    //------------------calculating distance-----------------------------------------------
    let distance = google.maps.geometry.spherical.computeLength(e.overlay.getPath().getArray());
    let kmdistance = distance/1000;

    //------------------calculating bearing-----------------------------------------------
    let pointA = e.overlay.getPath().getAt(0);
    let pointB = e.overlay.getPath().getAt(e.overlay.getPath().getLength() - 1);
    let heading = google.maps.geometry.spherical.computeHeading(pointA, pointB);
    console.log("heading",heading);
    if (heading < 0) {
        heading = 360 + heading;
    }


    attrList.value = [{parentID:e.overlay.id,attribute:'length',value:kmdistance.toFixed(2)+' Km'},{parentID:e.overlay.id,attribute:'bearing',value:heading.toFixed(2)+'°'}];
    e.overlay.properties = attrList.value;
    selectedLayer.value = e.overlay;
    //-------------------creating google mp feature for map data layer (later this will save as json)---
    let feature = new google.maps.Data.Feature({
        properties: {strokeColor: e.overlay.get('strokeColor'),strokeWeight: e.overlay.get('strokeWeight')},
        geometry: new google.maps.Data.LineString(e.overlay.getPath().getArray()),
        id:e.overlay.id
    });

    //-------------------------------------adding layer to map------------------------------------------
    map.data.add(feature);
    //-----------------hiding feature.because it is overlapping the layer-------------------------------
    map.data.overrideStyle(feature, {visible: false,});

        //-----------------------------------click listener for save layer----------------------------------
        google.maps.event.addListener(e.overlay, 'click', function () {

            // Restore the previously selected polyline's original options if available
            if (selectedLayer.value) {
                selectedLayer.value.setOptions(selectedLayer.value.originalOptions);
            }

            selectedLayer.value = e.overlay;
            let highlightOptions = highlightedOption(e);
            // let layerDataset = _.find(layerList.value, {'id': e.overlay.id});
            // attrList.value = layerDataset.properties;

            // Store the original options of the current polyline
            e.overlay.originalOptions = originalOption(e);

            // Apply the highlight options to the polyline
            e.overlay.setOptions(highlightOptions);
            store.commit('setTriggeredDrawingPolyline',selectedLayer.value)
        });



    return { selectedLayer, attrList };
};


