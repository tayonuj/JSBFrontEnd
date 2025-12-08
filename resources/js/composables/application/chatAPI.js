import {ref} from 'vue';
import notificationHandling from "../application/notificationHandling";
import { useLoading } from 'vue3-loading-overlay';

/**
 * this method is used to chat with G-SENTRY BOT using REST API
 * chatbot is developed in G-Sentry VPS server using python and RASA
 * @param question is the question that need to ask from the BOT
 * @returns {{text_response: Object}} returning the answer in a Object attributes are recipient_id & text
 * @returns {{custom_data: Object}} returning the extra data (Ex: Images,Datasets etc...) return attributes Image,data
 */
const chatAPI =  async (question) => {
    const text_response = ref({});
    const custom_data = ref({})
    let loader = useLoading();
    loader.show();
     await axios.post('https://chat.gsentry.cloud/ask', question)
        .then((response) => {
            if (response.data && response.data.length > 0){
                text_response.value = response.data[0]; // text_response
                if (response.data.length > 1)
                    custom_data.value = response.data[1]; // custom_response
            }else{
                text_response.value = {text:"Looks Like Server Respond with 0 result. Could you please try another the question?"}
                // notificationHandling("error","Something Went wrong")
            }

            console.log('Chat data', custom_data.value);
            loader.hide();
        })
        .catch((error) => {
            notificationHandling("error",error.message);
            loader.hide();
        });

    return {text_response,custom_data}
}

export default chatAPI;
