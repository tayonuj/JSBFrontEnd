import {ref} from 'vue';
import notificationHandling from "../application/notificationHandling";
import { useLoading } from 'vue3-loading-overlay';
import axios from 'axios';

/**
 * this method is used to generate axios URL generally
 * request is sending to this application
 * using api version 1
 * this is a dynamic method that can use for every project to use axios requests
 * @param url is the Request url without base ex: is the url = mycontroller/getData the request URL will be /api/v1/mycontroller/getData
 * @param payload
 * @param allow_loading
 * @returns {{json_data: Array}} returning the dataset generally. Initial result is null
 */
const generalAxiosRequest =  async (url,payload,allow_loading = true,$loading) => {
    let loader = null;
    const json_data = ref([]);
    if (allow_loading)
        loader = $loading.show();
     await axios.post('/api/v1/'+url, payload)
        .then((response) => {
            if (response.data && response.data.data){
                json_data.value = response.data.data; // Update the layerData property
            }else{
                notificationHandling("error","No Data Available")
            }

            console.log('MAIN data', json_data.value);
            // console.log("fucking loader",loader)
            if (loader)
            loader.hide();
        })
        .catch((error) => {
            notificationHandling("error",error.message);a
            if (loader)
            loader.hide();
        });

    return {json_data}
}

export default generalAxiosRequest;