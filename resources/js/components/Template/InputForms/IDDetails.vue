

<template>
    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item me-1" v-for="(section, index) in formConfig" :key="`tab-${index}`">
                <a
                    class="nav-link"
                    :class="{ active: activeTab === section.section }"
                    href="#"
                    @click.prevent="activeTab = section.section"
                >
                    {{ section.label }}
                </a>
            </li>
        </ul>
        <div class="tab-content pt-3">
            <form @submit.prevent="submitForm">
            <div v-for="(section, sectionIndex) in formConfig" :key="sectionIndex" v-show="activeTab === section.section">
                <div v-if="section.repeatable">
                    <div v-for="(item, itemIndex) in formData[section.section]" :key="`item-${itemIndex}`">
                        <RepeatableFormComponent :formFields="section.fields" :modelValue="item" @update:modelValue="updateRepeatableSection(section.section, itemIndex, $event)" />
                    </div>
                </div>
                <div v-else>
                    <div class="row">
                        <div v-for="(field, index) in section.fields" :key="index" class="col-md-3">
                            <div v-if="isFieldVisible(field)">
                                <component
                                    :is="components[field.component]"
                                    :label="field.label"
                                    :required="field.required"
                                    :items="getSelectItems(field,section.section)"
                                    :readonly="field.readonly || false"
                                    v-model="formData[section.section][field.model]"
                                    :validationTypes="field.validationTypes"
                                    :formSubmitted="formSubmitted"
                                    :isDisabled="field.isDisabled"
                                    :isMultiple="field.isMultiple"
                                    :minDate="getDates(field,section.section,'min_date',formData)"
                                    :maxDate="getDates(field,section.section,'max_date',formData)"
                                ></component>
                            </div>
                        </div>
                        <hr/>
                        <button class="btn btn-theme col-md-6 offset-3" type="submit">
                            Save & continue
                        </button>
                    </div>
                </div>
            </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import RepeatableFormComponent from "./CustomForms/RepeatableFormComponent.vue";
import formConfig from "./configs/idDetails.json";
import ujImageUpload from '../../Reusables/UIComponents/ujImageUpload.vue';
import ujSelect from '../../Reusables/UIComponents/ujSelect.vue';
import ujDatepicker from '../../Reusables/UIComponents/ujDatepicker.vue';
import ujInput from "../../Reusables/UIComponents/ujInput.vue";
import {onMounted, reactive, ref} from "vue";
import notificationHandling from "../../../composables/application/notificationHandling";
import {appendData, findItemInData, findLocalStorage, saveData} from "../../../composables/storage/LocalStorageHandler";
import {useStore} from "vuex";
import {checkUserGoThroughTheDetails, getDates} from "../../../composables/application/UIComponents/generalConfigurations";

const formData = reactive({
    NIC:{},
    DrivingLicense:{},
    PassportDetails:{},
});
const formSubmitted = ref(false);
const store = useStore();
const components = {
    ujImageUpload,
    ujSelect,
    ujDatepicker,
    ujInput
};

const activeTab = ref(formConfig[0].section);
const isFieldVisible = (field) => {
    if (!field.condition) return true;
    return new Function('formData', `return ${field.condition};`)(formData);
}


const updateRepeatableSection = (section, index, value) =>{
    formData[section][index] = value;
}


const getSelectItems = (field,section) => {
    if (section === 'DrivingLicense') {
        if (field.model === 'sub_categories' && formData.DrivingLicense.category) {
            console.log("return",formData.DrivingLicense.category)
            return formData.DrivingLicense.category === 'OLD' ?
                ['D', 'E', 'F', 'C', 'C1', 'B1', 'B', 'A1', 'A', 'G1', 'G'] :
                ['A1', 'A', 'B1', 'B', 'C1', 'C', 'CE', 'D1', 'D', 'DE', 'G1', 'G', 'J'];
        }
    }
    return field.items || [];
}



const submitForm = () => {
    formSubmitted.value = true
    setTimeout(function () {
        if (store.getters.hasValidationErrors) {
            notificationHandling('error','Please resolve the errors before submitting!')
        } else {
            let stepCompleted = checkUserGoThroughTheDetails(formConfig,activeTab.value);
            console.log("stepcomp",stepCompleted)
            if (stepCompleted  !== 'completed'){
                activeTab.value = stepCompleted;
            }else{
                let idArray = reformatDataset();
                console.log("idData",idArray)

                appendData('employee','ids',idArray)
                store.commit('setStep',3);
                saveData('stepper',3);

            }
        }
    },1000)

};



const reformatDataset = () => {
    formData.NIC.type = 'nic';
    formData.DrivingLicense.type = 'driving_license';
    formData.PassportDetails.type = 'passport';

    if (formData.DrivingLicense.sub_categories)
        formData.DrivingLicense.sub_categories = formData.DrivingLicense.sub_categories.toString()

    let idArray = [formData.NIC]

    if (formData.DrivingLicense.no){
        idArray.push(formData.DrivingLicense)
    }
    if (formData.PassportDetails.no){
        idArray.push(formData.PassportDetails)
    }
    return idArray
}

const findIDData = () => {
    formData.NIC.no = findItemInData('employee','emp_no');
}



onMounted(()=>{
    findIDData()
})
</script>
<style scoped>

</style>
