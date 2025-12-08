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
                                ></component>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
        <button @click="submitForm">Submit</button>
    </div>
</template>

<script setup>
import RepeatableFormComponent from "./CustomForms/RepeatableFormComponent.vue";
import formConfig from "./configs/jobInformation.json";
import ujImageUpload from '../../Reusables/UIComponents/ujImageUpload.vue';
import ujSelect from '../../Reusables/UIComponents/ujSelect.vue';
import ujDatepicker from '../../Reusables/UIComponents/ujDatepicker.vue';
import ujInput from "../../Reusables/UIComponents/ujInput.vue";
import {onMounted, reactive, ref, watch} from "vue";
import generalAxiosRequest from "../../../composables/application/generalAxiosRequest";
import loadArea from "../../../composables/layers/loadArea";
import {getSubOrganizationCodes} from "../../../composables/application/UIComponents/EmployementDetails";
import { JsonData } from "@amcharts/amcharts5";

const formData = reactive({
    CurrentService: {},
    PreviousService: [{}],
    Promotions: [{}],
    Salary: [{}],
    Loan: [{}],
    Leave: [{}],
    WOPDetails: [{}],
  ContactDetailOfficial:[{}],
  Transport:[{}]
});

const selectOptions = reactive({
    CurrentService: {org_l1:[],org_l2:[],org_l3:[],org_l4:[],org_l5:[],current_designation:[]},
})


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
const orgData = ref([]);

const getSelectItems = (field, section) => {
    if (selectOptions[section] && selectOptions[section][field.model]) {
        return selectOptions[section][field.model] || [];
    }

    return field.items || [];
}

const loadOrgData = async () => {
    const payload = {
        url: 'https://services.misgovernance.lk/api/v1/general-queries/readData',
        data: JSON.stringify({
            collection: 'organizations',
        })
    }
    const {json_data} = await generalAxiosRequest('curl-requests/post', payload, false);
    orgData.value = json_data.value;
    let grpData = _.map(orgData.value,function (o) {
        return o.code+"--"+o.name;
    });

    selectOptions.CurrentService.org_l1 = grpData;

    console.log("data received",orgData.value)
}

onMounted(()=> {
    loadOrgData()
})
function updateRepeatableSection(section, index, value) {
    formData[section][index] = value;
}

function submitForm() {
    // Handle form submission here
}

const selectionDependencies = {
    org_l1: {
       dependent: 'org_l2', nextLevel: 'org_l2'

    },
    org_l2: {
        dependent: 'org_l3', nextLevel: 'org_l3'
    },
    org_l3: {
        dependent: 'org_l4', nextLevel: 'org_l4'

    },
    org_l4: {
      dependent: 'org_l5', nextLevel: 'org_l5'
    },
};

/**
 * Iterates over the selectionDependencies to dynamically create watchers
 * for each selection in each section ('Permanent', 'Temporary', 'OfficialResidence').
 */
Object.keys(selectionDependencies).forEach(selectionKey => {
    ['CurrentService'].forEach(section => {createWatcher(selectionKey, section);});
});

/**
 * Defines a function to create a dynamic Vue watcher.
 * The watcher observes changes in the formData for a given selection and section.
 * Upon change, it fetches the new dependent selection options and updates the reactive selectOptions object.
 * @param selectionKey
 * @param section
 */
function createWatcher(selectionKey, section) {
    console.log("watcher ",section+"."+selectionKey);
    console.log("formData ",formData);
    watch(() => formData[section][selectionKey], async (newValue, oldValue) => {
        console.log("new value watcher",newValue);
        console.log("old value watcher",oldValue);
        if (newValue && newValue !== oldValue) {
            const configs = selectionDependencies[selectionKey];
            if (configs) {
                let code = newValue.split('--');
                code = code[0];
                console.log("code",code);
                let suborgs = getSubOrganizationCodes(orgData.value, code);

                console.log("subOrgs",suborgs.value);
                selectOptions[section][configs.dependent] = suborgs.value;
                loadSalaryCodes(code);
            }
        }
    });
}



const salary_codes = ref([]);

const loadSalaryCodes = async (org_code) => {
    const payload = {
        url: 'https://services.misgovernance.lk/api/v1/general-queries/readData',
        data: JSON.stringify({
            collection: 'salary_codes',
            attr:'org_code',
            filter_array: JSON.stringify([org_code])
        })
    }
    const {json_data} = await generalAxiosRequest('curl-requests/post', payload, false);
    salary_codes.value = json_data.value;
    selectOptions.CurrentService.current_designation = _.map(salary_codes.value,'designation');
    console.log("designations",json_data.value);
}

watch(() => formData.CurrentService.current_designation, async (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            setupDesignationValues(newValue);
        }
    });

const setupDesignationValues = (designation)=>{
    let scode = _.find(salary_codes.value,{designation:designation});
    console.log('selected_designation',scode);
    formData.CurrentService.service_level = scode.service_level;

}


</script>
<style scoped>

</style>
