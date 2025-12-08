import {ref} from "vue";

const toGeoJsonPromise = (map) => {
    return new Promise((resolve) => {
        map.data.toGeoJson(resolve);
    });
};

const saveDataLayer = async (map, layerList, layerName, spatialType) => {
    // try {
        const obj = await toGeoJsonPromise(map);

        // Apply attributes to the layers
        for (let feature of obj.features) {
            let layer = layerList.value.find(l => l.id === feature.id);
            if (layer) {
                feature.properties['ID'] = feature.id;
                for (let prop of layer.properties) {
                    feature.properties[prop.attribute] = prop.value;
                }
            }
        }

        // Removing unnecessary layers
        obj.features = obj.features.filter(feature => {
            return layerList.value.some(layer => layer.id === feature.id);
        });

        const { savedLayersList,savedLayerData } = await sendJsonToBackEnd(obj, layerName, spatialType);
        let savedData = savedLayerData.value;
        let savedList = savedLayersList.value;
        return {savedData,savedList};

    // } catch (error) {
    //     console.error("Error in saving data layer:", error);
    // }
};

export default saveDataLayer;

const savedLayerData = ref([]);
const savedLayersList = ref([]);
const sendJsonToBackEnd = async (json, layerName, spatialType) => {
    let formData = new FormData();
    formData.append("uid", null);
    formData.append("layername", layerName);
    formData.append("layerType", spatialType);
    formData.append("jsonData", JSON.stringify(json));

    try {
        const response = await axios.post('/api/v1/custom-layers/save', formData);
        console.log("layer saved", response.data);
        if (response.data.http_status === 'success') {
            savedLayersList.value = response.data.layer_list;
            savedLayerData.value = response.data.layerSet;
        } else {

        }
    } catch (error) {
        if (error.response && error.response.status === 401) {

        }
        console.error("Error in saving layer:", error);
    }

    return  {savedLayersList,savedLayerData} ;
};
