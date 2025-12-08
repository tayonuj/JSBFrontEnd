import { ref } from 'vue';


export default async function useMapDroneOverlay(map, tfwUrl, imageUrl) {
    const overlay = ref(null);
    const tfwData = await fetchTFWData(tfwUrl);
    const {width, height} = await getImageDimensions(imageUrl);
    const { mapCustomOverlay } = await import('./mapCustomOverlay');

    const createOverlay = () => {
        const bounds = calculateBounds(tfwData, width, height);
        overlay.value = new mapCustomOverlay(bounds,imageUrl);
        overlay.value.setMap(map);
        zoomIntoImage(bounds);
        alert('created')
    };

    const removeOverlay = () => {
        if (overlay.value) {
            overlay.value.setMap(null);
            overlay.value = null;
        }
    };
    const zoomIntoImage = (bounds) => {
        const center = bounds.getCenter();
        const zoomLevel = calculateZoomLevel(bounds,map); // This function needs to be defined
        map.setCenter(center);
        map.setZoom(zoomLevel);
    };
    return {overlay, createOverlay, removeOverlay};
}

function calculateZoomLevel(bounds, map) {
    const GLOBE_WIDTH = 256; // a constant in Google's map projection
    const west = bounds.getSouthWest().lng();
    const east = bounds.getNorthEast().lng();
    let angle = east - west;
    if (angle < 0) {
        angle += 360;
    }
    const zoomMax = 21;

    return Math.round(Math.log(map.getDiv().offsetWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
}

async function fetchTFWData(tfwUrl) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = proxyUrl + tfwUrl;

    try {
        const response = await fetch(url);
        const text = await response.text();
        return text.split('\n').map(line => parseFloat(line)).filter(num => !isNaN(num));
    } catch (error) {
        console.error('Error fetching TFW data:', error);
        return null;
    }
}


function calculateBounds(tfwData, imageWidth, imageHeight) {
    const [pixelSizeX, , , pixelSizeY, originX, originY] = tfwData;

    const lowerRightX = originX + pixelSizeX * imageWidth;
    const lowerRightY = originY + pixelSizeY * imageHeight; // Note the addition here since pixelSizeY is negative
    console.log("south west ",lowerRightY+"_"+originX)
    console.log("Northeast ",originY+"_"+lowerRightX)
    const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(lowerRightY, originX), // Southwest corner
        new google.maps.LatLng(originY, lowerRightX)  // Northeast corner
    );

    return bounds;
}



function getImageDimensions(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = imageUrl;
    });
}
