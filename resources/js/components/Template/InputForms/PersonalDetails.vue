<template>
    <div>
        <form @submit.prevent="submitForm">
            <div class="row ">
                <div v-for="(field, index) in formConfig" :key="index" class="col-md-4">
                    <div v-if="isFieldVisible(field)">
                        <component
                            :is="components[field.component]"
                            :label="field.label"
                            :required="field.required"
                            :items="field.items || []"
                            :readonly="field.readonly || false"
                            :v-model="formData[field.model]"
                            :validationTypes="field.validationTypes"
                            :formSubmitted="formSubmitted"

                        ></component>
                    </div>
                </div>
            <button class="btn  btn-primary col-md-2 offset-5" type="submit">Save & continue</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import {reactive, watch, computed, ref} from 'vue';
import formConfig from './configs/personalDetails.json';

import ujImageUpload from '../../Reusables/UIComponents/ujImageUpload.vue';
import ujInput from "../../Reusables/UIComponents/ujInput.vue";
import ujSelect from '../../Reusables/UIComponents/ujSelect.vue';
import ujDatepicker from '../../Reusables/UIComponents/ujDatepicker.vue';

import {calculateAge} from "../../../composables/Helpers/PersonalDetails";
import {useStore} from "vuex";
import notificationHandling from "../../../composables/application/notificationHandling";
import {saveData} from "../../../composables/storage/LocalStorageHandler";

const formData = reactive({});
const components = {
  ujImageUpload,
  ujSelect,
  ujDatepicker,
  ujInput
};
const formSubmitted = ref(false)
const store = useStore();

const isFieldVisible = (field) => {
  console.log("field",field)
    if (!field.condition) return true;
    return new Function('formData', `return ${field.condition};`)(formData);

}

// Watch DOB and calculate age automatically
// watch(() => formData.dob, (newDob) => {
//     formData.age = calculateAge(newDob);
// });


// const submitForm = () => {
//     console.log("personal details",formData)
//     formSubmitted.value = true
//     setTimeout(function () {
//         if (store.getters.hasValidationErrors) {
//             notificationHandling('error','Please resolve the errors before submitting!')
//         } else {
//             store.commit('setStep',2);
//             saveData('employee',formData);
//             saveData('stepper',2);
//
//         }
//     },1000)
//
// };

</script>
