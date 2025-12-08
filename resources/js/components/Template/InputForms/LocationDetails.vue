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
                                    :section="section.section"
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
import formConfig from "./configs/locationDetails.json";
import ujImageUpload from '../../Reusables/UIComponents/ujImageUpload.vue';
import ujSelect from '../../Reusables/UIComponents/ujSelect.vue';
import ujDatepicker from '../../Reusables/UIComponents/ujDatepicker.vue';
import ujInput from "../../Reusables/UIComponents/ujInput.vue";
import {reactive, ref, watch} from "vue";
import loadArea from "../../../composables/layers/loadArea";
import {checkUserGoThroughTheDetails, getDates} from "../../../composables/application/UIComponents/generalConfigurations";
import notificationHandling from "../../../composables/application/notificationHandling";
import {appendData, saveData} from "../../../composables/storage/LocalStorageHandler";
import {useStore} from "vuex";

const formData = reactive({
    Permanent:{},
    Temporary:{},
    OfficialResidence:{},
});


const components = {
    ujImageUpload,
    ujSelect,
    ujDatepicker,
    ujInput
};
const formSubmitted = ref(false);
const activeTab = ref(formConfig[0].section);
const store = useStore();
const isFieldVisible = (field) => {
    if (!field.condition) return true;
    return new Function('formData', `return ${field.condition};`)(formData);
}


const selectOptions = reactive({
    Permanent:{district: [], dsd: [], gnd: [], electorate:[], postal_code:[]},
    Temporary:{district: [], dsd: [], gnd: [], electorate:[], postal_code:[]},
    OfficialResidence:{district: [], dsd: [], gnd: [], electorate:[], postal_code:[]},
});

const getSelectItems = (field, section) => {
    if (selectOptions[section][field.model]) {
        return selectOptions[section][field.model] || [];
    }

    return field.items || [];
}
/**
 * Configuration object mapping each selection to its dependent selection and the next level of selection to fetch.
 * This setup helps in understanding which selections depend on the change of another selection.
 * @type {{province: {dependencies: [{nextLevel: string, dependent: string},{nextLevel: string, dependent: string}]}, dsd: {dependencies: [{nextLevel: string, dependent: string}]}, district: {dependencies: [{nextLevel: string, dependent: string},{nextLevel: string, dependent: string}]}}}
 */

const selectionDependencies = {
    province: {
        dependencies: [
            { dependent: 'district', nextLevel: 'district' },
            { dependent: 'electorate', nextLevel: 'electorate' }
        ]
    },
    district: {
        dependencies: [
            { dependent: 'dsd', nextLevel: 'dsd' },
            { dependent: 'postal_code', nextLevel: 'postal_code' }
        ]
    },
    dsd: {
        dependencies: [
            {dependent: 'gnd', nextLevel: 'gnd'},
        ]
    }
};

/**
 * Iterates over the selectionDependencies to dynamically create watchers
 * for each selection in each section ('Permanent', 'Temporary', 'OfficialResidence').
 */
Object.keys(selectionDependencies).forEach(selectionKey => {
    ['Permanent', 'Temporary', 'OfficialResidence'].forEach(section => {createWatcher(selectionKey, section);});
});


/**
 * Defines a function to create a dynamic Vue watcher.
 * The watcher observes changes in the formData for a given selection and section.
 * Upon change, it fetches the new dependent selection options and updates the reactive selectOptions object.
 * @param selectionKey
 * @param section
 */
function createWatcher(selectionKey, section) {
    watch(() => formData[section][selectionKey], async (newValue, oldValue) => {
        console.log("new value",newValue);
        console.log("old value",oldValue);
        if (newValue && newValue !== oldValue) {
            const configs = selectionDependencies[selectionKey]?.dependencies;
            if (configs && configs.length) {
                await Promise.all(configs.map(async (config) => {
                    const data = await loadArea(selectionKey, newValue, config.nextLevel);
                    selectOptions[section][config.dependent] = data[`${config.dependent}_list`];
                }));
                // Reset child selections to null
                // configs.forEach(config => {
                //     Object.keys(selectionDependencies).forEach(key => {
                //         if (selectionDependencies[key]?.dependencies?.some(dep => dep.dependent === config.dependent)) {
                //             formData[section][key] = null;
                //         }
                //     });
                // });
            }
        }
    });
}



function updateRepeatableSection(section, index, value) {
    formData[section][index] = value;
}

function submitForm() {
    console.log("fucking form data",formData)
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
                let locationArray = reformatDataset();
                console.log("locationData",locationArray)
                appendData('employee','locations',locationArray)
                store.commit('setStep',4);
                saveData('stepper',4);

            }
        }
    },1000)
}
const reformatDataset = () => {
    formData.Permanent.type = 'permanent';
    formData.Temporary.type = 'temporary';
    formData.OfficialResidence.type = 'residence';

    let dataArray = [formData.Permanent]

    if (formData.Temporary.house_no){
        dataArray.push(formData.Temporary)
    }
    if (formData.OfficialResidence.house_no){
        dataArray.push(formData.OfficialResidence)
    }
    return dataArray
}
</script>
<style scoped>

</style>
