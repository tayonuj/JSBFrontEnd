import {ref} from "vue";

export const initMarkerOption = (color,scale)=>{
    return {
        draggable: false,
        optimized: false,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: scale,
            fillColor: color,
            fillOpacity: 0.75,
            strokeWeight: 0.3,
        }
    }
}
const highlightedOption = (e)=>{
    return {
        icon: {path: google.maps.SymbolPath.CIRCLE,
            scale: e.overlay.icon.scale*2,
            fillColor: e.overlay.icon.fillColor,
            fillOpacity: 0.8,
            strokeWeight: 0.35,
            labelOrigin: {x: -7, y: 0}
        }
    }
}

const originalOption = (e)=>{
    return {
        icon: {path: google.maps.SymbolPath.CIRCLE,
            scale: e.overlay.icon.scale,
            fillColor: e.overlay.icon.fillColor,
            fillOpacity: 0.6,
            strokeWeight: 0.3,
            labelOrigin: {x: -7, y: 0}
        },
    }
}
const attrList = ref([]);
const selectedLayer = ref([]);
export const markerOverLayCompleteOptions = async (e, map, scale, color,store) => {
    let geocoder = new google.maps.Geocoder();
    let latLng = e.overlay.getPosition();

    // Create a new promise for the geocoding operation
    const geocodePromise = new Promise((resolve, reject) => {
        geocoder.geocode({ 'location': latLng }, (results, status) => {
            if (status === 'OK' && results[0]) {
                resolve(results[0].formatted_address); // Resolve with the address
            } else {
                reject("Geocoding failed: " + status); // Reject if there's an error
            }
        });
    });

    try {
        // Await the result of the geocoding operation
        let address = await geocodePromise;

        // Continue with your logic after getting the address
        attrList.value = [
            { parentID: e.overlay.id, attribute: 'latitude', value: latLng.lat() },
            { parentID: e.overlay.id, attribute: 'longitude', value: latLng.lng() },
            { parentID: e.overlay.id, attribute: 'address', value: address }
        ];

        e.overlay.properties = attrList.value;
        selectedLayer.value = e.overlay;

        //-------------------creating google mp feature for map data layer (later this will save as json)---
        let feature = new google.maps.Data.Feature({
            properties: {
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: scale.value,
                    fillColor: color.value,
                    fillOpacity: 0.6,
                    strokeWeight: 0.3,
                    labelOrigin: {x: -7, y: 0}
                }
            },
            geometry: new google.maps.Data.Point(latLng),
            id: e.overlay.id
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
            store.commit('setTriggeredDrawingMarker',selectedLayer.value)
        });

    } catch (error) {
        console.error('Geocoder failed:', error);
        // Handle the error case
    }

    return { selectedLayer, attrList };
};


