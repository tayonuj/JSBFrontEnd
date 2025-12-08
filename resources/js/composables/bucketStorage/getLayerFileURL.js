import {ref} from 'vue';
import notificationHandling from "../application/notificationHandling";
import {useLoading} from "vue3-loading-overlay";

/**
 * *Function is retrieving the file (GIS Layer) as a JSON from back-end
 * TODO : this may include a token in the header near future
 * response should contain the .data with the feature collection dataset
 * @param url {string}is the url that system should deploy the search in google bucket
 * @param filter_attribute is to use filter array using attribute ex: District,DSD,GND
 * @param filter_array is the filtered name array of the data
 * @returns {Promise<{layerData: $ObjMap}>} returning the feature collection JSON
 * @author Tayon U J
 * @version 1.0.0
 */
const getLayerFileURL =  async (url,filter_attribute = null,filter_array = null) => {
    const layerData = ref({});
    let loader = useLoading();
    loader.show();
    await axios.post('https://gisservice.gsentry.org/api/v1/gis-layers/readURL', {path: url,filter_attribute,filter_array}, {})
        .then((response) => {
            let data = response.data;
            console.log('layer URL', data);
            if (data && data.data) {
                layerData.value = data.data;
            } else {
                notificationHandling("error","No URL Found")
            }
            loader.hide();
        })
        .catch((error) => {
            notificationHandling("error",error.message)
            loader.hide();
        });

    return {layerData}
}

export default getLayerFileURL;
