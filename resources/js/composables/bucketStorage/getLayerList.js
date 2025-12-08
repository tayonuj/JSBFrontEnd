import {ref} from 'vue';
import notificationHandling from "../application/notificationHandling";
import { useLoading } from 'vue3-loading-overlay';
// Import stylesheet

/**
 * this method is used to list the folder name associated with project folder
 * project code should pass as a parameter
 * Back-end is written in gsentry.org shared server
 * this is a dynamic method that can use for every project to load the API
 * @param projectCode
 * @returns {{layerData: Ref<UnwrapRef<*[]>>, error: Ref<UnwrapRef<string>>}}
 */
const getLayerList = (projectCode) => {
    const layerData = ref([]);
    let loader = useLoading();
    loader.show();
    axios.get('https://gisservice.gsentry.org/api/v1/gis-layers/'+projectCode, {})
        .then((response) => {
            if (response.data && response.data.data){
                layerData.value = response.data.data; // Update the layerData property
            }else{
                notificationHandling("error","No Data Available")
            }

            console.log('MAIN data', layerData.value);
            loader.hide();
        })
        .catch((error) => {
            notificationHandling("error",error.message);
            loader.hide();
        });

    return {layerData}
}

export default getLayerList;
