import {ref} from "vue";

export const initRectangleOption = (color,scale)=>{
    return {
        drawingMode: null,
        drawingControl: false,
        rectangleOptions: {
            editable: false,
            draggable: false,
            optimized: false,
            strokeColor: color,
            strokeWeight: scale,
            fillColor: color,
            fillOpacity: 0.45,
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
export const rectangleOverLayCompleteOptions = async (e, map, scale, color,store) => {

    e.overlay.properties = [];
    console.log("rectangle ",e);

    var b = e.overlay.getBounds(),
        p = [b.getSouthWest(), {
            lat: b.getSouthWest().lat(),
            lng: b.getNorthEast().lng()
        },
            b.getNorthEast(), {
                lng: b.getSouthWest().lng(),
                lat: b.getNorthEast().lat()
            }
        ];
    let path = [p];

    var rectBoundsLatlng = [];
    var rectBoundsLatlngPath = [];

    rectBoundsLatlng[0] = new google.maps.LatLng(path[0][1].lat, path[0][1].lng);
    rectBoundsLatlng[1] = new google.maps.LatLng(path[0][3].lat, path[0][3].lng);
    rectBoundsLatlngPath[0] = new google.maps.LatLng(rectBoundsLatlng[1].lat(), rectBoundsLatlng[0].lng());
    rectBoundsLatlngPath[1] = new google.maps.LatLng(rectBoundsLatlng[0].lat(), rectBoundsLatlng[1].lng());

    var areaPath = [
        rectBoundsLatlng[0],
        rectBoundsLatlngPath[0],
        rectBoundsLatlng[1],
        rectBoundsLatlngPath[1],
        rectBoundsLatlng[0]
    ];

    let center = rectBoundsLatlngPath[0];
    var area = google.maps.geometry.spherical.computeArea(areaPath);
    console.log("area ",area);
    attrList.value = [{parentID:e.overlay.id,attribute:'area',value:area.toFixed(2)+' ㎡'}];
    e.overlay.properties = attrList.value;
    selectedLayer.value = e.overlay;
    //-------------------creating google mp feature for map data layer (later this will save as json)---
    let feature = new google.maps.Data.Feature({
        properties: {fillColor: e.overlay.get('fillColor'),strokeWeight: e.overlay.get('strokeWeight')},
        geometry: new google.maps.Data.Polygon([p]),
        id:e.overlay.id
    });


    //-------------------------------------adding layer to map------------------------------------------
    map.data.add(feature);
    //-----------------hiding feature.because it is overlapping the layer-------------------------------
    map.data.overrideStyle(feature, {visible: false,});

        //-----------------------------------click listener for save layer----------------------------------
        google.maps.event.addListener(e.overlay, 'click', function () {

            // Restore the previously selected rectangle's original options if available
            if (selectedLayer.value) {
                selectedLayer.value.setOptions(selectedLayer.value.originalOptions);
            }

            selectedLayer.value = e.overlay;
            let highlightOptions = highlightedOption(e);
            // let layerDataset = _.find(layerList.value, {'id': e.overlay.id});
            // attrList.value = layerDataset.properties;

            // Store the original options of the current rectangle
            e.overlay.originalOptions = originalOption(e);

            // Apply the highlight options to the rectangle
            e.overlay.setOptions(highlightOptions);
            store.commit('setTriggeredDrawingRectangle',selectedLayer.value)
        });



    return { selectedLayer, attrList };
};


