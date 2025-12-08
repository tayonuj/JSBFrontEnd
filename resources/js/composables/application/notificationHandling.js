import {useToast} from "vue-toastification";

/**
 * *Function is use to display error , success messages as a notification on the application
 * !vue3-toastify version 0.1.12 should be installed
 * @param type {String} is use to identify the message belongs to error or success. values should be (error,success)
 * @param message {String} should includes the message to display. this should be user friendly message
 */
const notificationHandling = (type,message) =>{
    const toast = useToast();
    switch (type) {
        case 'error' : toast.error(message);
                        break;
        case 'success' : toast.success(message);
                        break;
        default : toast.info(message);
    }
}
export default notificationHandling;
