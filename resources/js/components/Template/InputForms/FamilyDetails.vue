<template>
    <div>
        <form @submit.prevent="submitForm">
            <ul class="nav nav-tabs">
                <li class="nav-item me-1" v-for="(section, index) in formConfig" :key="`tab-${index}`">
                    <a v-if="checkTabAvailability(section.section)" class="nav-link" :class="{ active: activeTab === section.section }" href="#" @click.prevent="activeTab = section.section">
                        {{ section.label }}
                    </a>
                </li>
            </ul>
            <div class="tab-content pt-3">
            <div v-for="(section, sectionIndex) in formConfig" :key="sectionIndex" v-show="activeTab === section.section">
                <div v-if="section.repeatable">
                    <div v-for="(item, itemIndex) in formData[section.section]" :key="`item-${itemIndex}`">
                        <RepeatableFormComponent
                            :formFields="section.fields"
                            :modelValue="item"
                            :section="section.section"
                            relationShip="relationship"
                            @update:items="updateTableItems(section.section,$event)"
                        />
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
                                    :items="field.items || []"
                                    :readonly="field.readonly || false"
                                    v-model="formData[section.section][field.model]"
                                    :minDate="getDates(field,section.section,'min_date',formData)"
                                    :maxDate="getDates(field,section.section,'max_date',formData)"
                                    :section="section.section"
                                ></component>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <button class="btn btn-theme col-md-6 offset-3" type="submit">
                Save & continue
            </button>
        </form>
    </div>
</template>

<script setup>
import RepeatableFormComponent from "./CustomForms/RepeatableFormComponent.vue";
import formConfig from "./configs/familyDetails.json";
import ujImageUpload from '../../Reusables/UIComponents/ujImageUpload.vue';
import ujSelect from '../../Reusables/UIComponents/ujSelect.vue';
import ujDatepicker from '../../Reusables/UIComponents/ujDatepicker.vue';
import ujInput from "../../Reusables/UIComponents/ujInput.vue";
import {onMounted, reactive, ref} from "vue";
import {checkUserGoThroughTheDetails, getDates} from "../../../composables/application/UIComponents/generalConfigurations";
import {appendData, findItemInData, saveData} from "../../../composables/storage/LocalStorageHandler";
import {useStore} from "vuex";

const formData = reactive({
    mother: {},
    farther: {},
    guardian: {},
    spouse: [{}],
    children: [{}],
    spouse_data: [{}],
    children_data: [{}],
});


const components = {
    ujImageUpload,
    ujSelect,
    ujDatepicker,
    ujInput
};

const activeTab = ref(formConfig[0].section);
const store = useStore();
const isFieldVisible = (field) => {
    if (!field.condition) return true;
    return new Function('formData', `return ${field.condition};`)(formData);
}

const updateTableItems = (section,value) => {
    console.log("updating..."+section,value);
    formData[section+'_data'] = value;
    if (section === 'spouse'){
        let childIndex = _.findIndex(formConfig,{section:'children'});
        let fieldIndex = _.findIndex(formConfig[childIndex].fields,{'model':'relationship_link'});
        let sp_arr = _.map(value,function (o) {
            return o.name+" - "+o.nic
        })
        formConfig[childIndex].fields[fieldIndex].items = sp_arr;
        let spouseIndex = _.findIndex(formConfig,{section:'spouse'});
        let spouseFieldIndex = _.findIndex(formConfig[spouseIndex].fields,{'model':'relationship_link'});
        let spouseExist = _.find(value,{'relationship_link':'CurrentlyMarried'});
        if (spouseExist)
            formConfig[spouseIndex].fields[spouseFieldIndex].items = ["Divorced", "Widow"];
        else
            formConfig[spouseIndex].fields[spouseFieldIndex].items = ["CurrentlyMarried", "Divorced", "Widow"];
    }

}

function submitForm() {
    console.log("fucking form data family",formData);

    let stepCompleted = checkUserGoThroughTheDetails(formConfig,activeTab.value);
    console.log("stepcomp",stepCompleted)
    if (stepCompleted  !== 'completed'){
        activeTab.value = stepCompleted;
    }else{
        let familyArray = reformatDataset();
        console.log("family array",familyArray)
        appendData('employee','family',familyArray)
        store.commit('setStep',5);
        saveData('stepper',5);

    }
}

const reformatDataset = () => {
    formData.mother.relationship = 'mother';
    formData.farther.relationship = 'farther';
    formData.guardian.relationship = 'guardian';
    let dataArray = []

    if (formData.farther.name){
        dataArray.push(formData.farther)
    }
    if (formData.spouse_data.length > 0){
        dataArray = _.concat(dataArray,formData.spouse_data)
    }
    if (formData.children_data.length > 0 && formData.children_data[0].name){
        dataArray = _.concat(dataArray,formData.children_data)
    }
    if (formData.mother.name){
        dataArray.push(formData.mother)
    }
    if (formData.guardian.name){
        dataArray.push(formData.guardian)
    }
    return dataArray
}

const isMarried = ref(false);
const findCivilData = () => {
    let status = findItemInData('employee','civil_status');
    if(status === 'Single'){
        activeTab.value = formConfig[2].section
        isMarried.value = false;
    }else{
        isMarried.value = true;
    }
}
const checkTabAvailability = (section) => {
  if (!isMarried.value && (section === 'spouse' || section === 'children')){
      console.log("return false"+section)
      return false;
  }else{
      return true;
  }
}


onMounted(()=>{
    findCivilData()
})

</script>
<style scoped>

</style>
