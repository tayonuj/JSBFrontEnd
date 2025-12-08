import {ref} from 'vue';
import _ from "lodash";
import {useStore} from "vuex";
import mapBounds from "./mapBounds";
import notificationHandling from "../application/notificationHandling";
import {useLoading} from "vue3-loading-overlay";
import geojsonvt from 'geojson-vt';
import simplify from '@turf/simplify';

/**
 * *Function is using for preview Feature collection JSON inside the Google map as tiles
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

// At the top of your file or inside your component/script
const tileCache = {};
const loadGeoJSONOnMap = (geoString, layerName, url, map, googleProperty, uniqueID, store, color = '#F00', $loading) => {
    let loader = useLoading();
    // if (allow_loading)
    loader.show();
    let overlay;
    const previewedLayer = ref({})
    try {
        // Preprocess the GeoJSON data
        // const preprocessedGeoJSON = preprocessGeoJSON(geoString);
        const preprocessedGeoJSON = geoString;
        // console.log("preprocessed fuck",preprocessedGeoJSON)
        // Create vector tiles from the GeoJSON
        const tileIndex = geojsonvt(preprocessedGeoJSON, {
            maxZoom: 14,  // max zoom to preserve detail on; can't be higher than 24
            tolerance: 3, // simplification tolerance (higher means simpler)
            extent: 256, // tile extent (both width and height)
            buffer: 64,   // tile buffer on each side
            debug: 0,     // logging level (0 to disable, 1 or 2)
            lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
            promoteId: null,    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
            generateId: false,  // whether to generate feature ids. Cannot be used with `promoteId`
            indexMaxZoom: map.getZoom(),       // max zoom in the initial tile index
            indexMaxPoints: 100000 // max number of points per tile in the index
        });

        // Custom Overlay for Google Maps
        class GeoJSONOverlay extends google.maps.OverlayView {
            constructor() {
                super();
                this.renderedPolygons = []; // This array will store the currently rendered polygons
            }
            draw() {
                const projection = this.getProjection();
                const zoom = map.getZoom();
                const bounds = map.getBounds();

                if (!bounds) return;

                const tileBounds = {
                    minX: lngX(bounds.getSouthWest().lng(), zoom),
                    minY: latY(bounds.getNorthEast().lat(), zoom),
                    maxX: lngX(bounds.getNorthEast().lng(), zoom),
                    maxY: latY(bounds.getSouthWest().lat(), zoom),
                };

                // for (let x = tileBounds.minX; x <= tileBounds.maxX; x++) {
                //     for (let y = tileBounds.minY; y <= tileBounds.maxY; y++) {
                //         const tile = tileIndex.getTile(zoom, x, y);
                //         if (!tile) continue;
                //
                //         tile.features.forEach(feature => {
                //             console.log("tile fucking features",feature);
                //             switch (feature.type) {
                //                 case 1: // Points
                //                     // Implement point rendering here
                //                     break;
                //                 case 2: // Lines
                //                     this.renderLine(feature);
                //                     break;
                //                 case 3: // Polygons
                //                     this.renderPolygon(feature,zoom,x,y);
                //                     break;
                //             }
                //         });
                //     }
                // }
                // Use requestAnimationFrame to manage drawing for smoother performance
                requestAnimationFrame(() => this.drawTiles(tileBounds, zoom));
            }
            drawTiles(tileBounds, zoom) {
                // Clear previously rendered polygons
                this.renderedPolygons.forEach(polygon => polygon.setMap(null));
                this.renderedPolygons.length = 0; // Empty the array
                for (let x = tileBounds.minX; x <= tileBounds.maxX; x++) {
                    for (let y = tileBounds.minY; y <= tileBounds.maxY; y++) {
                        // Create a unique key for the tile
                        const tileKey = `${zoom}-${x}-${y}`;

                        // Check if the tile is in the cache
                        if (tileCache[tileKey]) {
                            this.renderFeatures(tileCache[tileKey],zoom, x, y);
                            continue;
                        }

                        // If not, generate a new tile and cache it
                        const tile = tileIndex.getTile(zoom, x, y);
                        if (tile) {
                            tileCache[tileKey] = tile;
                            this.renderFeatures(tile,zoom, x, y);
                        }


                    }
                }
            }
            renderFeatures(tile,zoom,x,y) {
                tile.features.forEach((feature) => {
                    switch (feature.type) {
                        case 1: // Points
                            // Implement point rendering here
                            break;
                        case 2: // Lines
                            // this.renderLine(feature);
                            break;
                        case 3: // Polygons
                            this.renderPolygon(feature, zoom, x, y);
                            break;
                    }
                });
            }

            renderLine(feature) {
                const path = feature.geometry.map(g => {
                    return { lat: g[1], lng: g[0] };
                });

                const polyline = new google.maps.Polyline({
                    path: path,
                    strokeColor: color,
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                });

                polyline.setMap(map);
            }

            renderPolygon(feature, zoom, tileX, tileY) {
                // Assuming each feature's geometry is an array of rings, where the first ring is the outer boundary
                if (feature.geometry.length > 0) {
                    const outerBoundary = feature.geometry[0]; // This assumes the first ring is the outer boundary
                    const paths = outerBoundary.map(coord => {
                        const geoCoords = tileCoordsToLatLng(coord[0], coord[1], zoom, tileX, tileY);
                        return { lat: geoCoords.lat, lng: geoCoords.lng };
                    });

                    const polygon = new google.maps.Polygon({
                        paths: paths,
                        strokeColor: color,
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        fillColor: color,
                        fillOpacity: 0,
                    });
                    console.log("polygon created",polygon);
                    polygon.setMap(map);
                    this.renderedPolygons.push(polygon); // Store the polygon for later removal
                }
            }

        }
        function tileCoordsToLatLng(x, y, zoom, tileX, tileY) {
            const resolution = (2 * Math.PI * 6378137) / (256 * Math.pow(2, zoom)); // Earth circumference / tile size at given zoom
            const pixelX = (tileX * 256) + x;
            const pixelY = (tileY * 256) + y;

            const lng = (pixelX * resolution - Math.PI * 6378137) / 6378137 * (180 / Math.PI);
            const latRadians = Math.atan(sinh(Math.PI * (1 - 2 * pixelY / (256 * Math.pow(2, zoom)))));
            const lat = latRadians * (180 / Math.PI);

            return { lat, lng };
        }

        function sinh(x) {
            return (Math.exp(x) - Math.exp(-x)) / 2;
        }




        // Create and add the overlay to the map
        overlay = new GeoJSONOverlay();
        overlay.setMap(map);
// Add idle event listener to the map
        map.addListener('idle', function() {
            // Clear the old tiles and redraw the overlay
            overlay.draw(); // Assuming that your overlay has a draw method that needs to be called
        });

        previewedLayer.value = {
            url: url,
            name: layerName,
            data: overlay, // Set the custom overlay as the data
            filteredData: overlay, // Assuming filteredData is the same as data
            properties: [], // Initialize properties, to be populated as needed
            attributes: [], // Initialize attributes, to be populated as needed
            id: uniqueID,
            data_id: uniqueID,
            queries: "",
            color: color,
            scale: 4,
            setMap: (mapOrNull) => overlay.setMap(mapOrNull), // Function to show/hide the layer
        };
        loader.hide();
    } catch (e) {
        notificationHandling("error",e.message)
        console.error(e);
        loader.hide();
    }


    return { previewedLayer };
}

// Helper functions for tile calculation
function lngX(lng, zoom) {
    return Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
}

function latY(lat, zoom) {
    const latRadians = lat * Math.PI / 180;
    return Math.floor((1 - Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI) / 2 * Math.pow(2, zoom));
}

// GeoJSON preprocessing functions
function preprocessGeoJSON(geoJSON) {
    if (!isValidGeoJSON(geoJSON)) {
        throw new Error("Invalid GeoJSON data.");
    }

    const tolerance = 0.01; // Adjust tolerance as needed
    return simplifyGeoJSON(geoJSON, tolerance);
}

function isValidGeoJSON(geoJSON) {
    if (!geoJSON || typeof geoJSON !== 'object') {
        return false;
    }

    if (geoJSON.type !== 'FeatureCollection' || !Array.isArray(geoJSON.features)) {
        return false;
    }

    for (const feature of geoJSON.features) {
        if (feature.type !== 'Feature' || !feature.geometry) {
            return false;
        }
    }

    return true;
}

function simplifyGeoJSON(geoJSON, tolerance) {
    const simplifiedFeatures = geoJSON.features.map(feature => {
        return simplify(feature, { tolerance: tolerance, highQuality: true });
    });

    return {
        ...geoJSON,
        features: simplifiedFeatures
    };
}

export default loadGeoJSONOnMap;
