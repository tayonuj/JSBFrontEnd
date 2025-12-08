import {ref} from "vue";
import {markerOverLayCompleteOptions,initMarkerOption} from "./Marker";
import {initPolylineOption, polyLineOverLayCompleteOptions} from "./Polyline";
import {initPolygonOption, polygonOverLayCompleteOptions} from "./Polygon";
import {circleOverLayCompleteOptions, initCircleOption} from "./Circle";
import {initRectangleOption, rectangleOverLayCompleteOptions} from "./Rectangle";

let drawingManager = ref(null);
let scale = 3;
let color = '#000';


export const initializeDrawingManager = (map) => {
    drawingManager.value = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        markerOptions: initMarkerOption(color, scale),
        polylineOptions: initPolylineOption(color, scale),
        polygonOptions: initPolygonOption(color, scale),
        circleOptions: initCircleOption(color, scale),
        rectangleOptions: initRectangleOption(color, scale),
    });

    drawingManager.value.setMap(map);

    return drawingManager;
};
export const handleOverlayComplete = (map, spatialType,store, callback) => {
    google.maps.event.addListener(drawingManager.value, 'overlaycomplete', async (e) => {
        drawingManager.value.setDrawingMode(null);
        e.overlay.id = Math.floor(Math.random() * 9999) + 1;
        e.overlay.properties = [];
        switch (spatialType) {
            case 'Point' : try {
                                    const { selectedLayer, attrList } = await markerOverLayCompleteOptions(e, map, scale, color,store);
                                    callback({ selectedLayer, attrList });
                                } catch (error) {
                                    console.error("Error in overlay completion:", error);
                                }
                                break;
            case 'polyline' : try {
                                    const { selectedLayer, attrList } = await polyLineOverLayCompleteOptions(e, map, scale, color,store);
                                    callback({ selectedLayer, attrList });
                                } catch (error) {
                                    console.error("Error in overlay completion:", error);
                                }
                                break;
            case 'polygon' : try {
                                    const { selectedLayer, attrList } = await polygonOverLayCompleteOptions(e, map, scale, color,store);
                                    callback({ selectedLayer, attrList });
                                } catch (error) {
                                    console.error("Error in overlay completion:", error);
                                }
                                break;
            case 'circle' : try {
                                    const { selectedLayer, attrList } = await circleOverLayCompleteOptions(e, map, scale, color,store);
                                    callback({ selectedLayer, attrList });
                                } catch (error) {
                                    console.error("Error in overlay completion:", error);
                                }
                                break;
            case 'rectangle' : try {
                                    const { selectedLayer, attrList } = await rectangleOverLayCompleteOptions(e, map, scale, color,store);
                                    callback({ selectedLayer, attrList });
                                } catch (error) {
                                    console.error("Error in overlay completion:", error);
                                }
                                break;
        }


    });
};





