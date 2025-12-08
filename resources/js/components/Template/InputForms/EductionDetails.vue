

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
                                    :items="field.items || []"
                                    :readonly="field.readonly || false"
                                    v-model="formData[field.model]"
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
import formConfig from "./configs/educationDetails.json";
import ujImageUpload from '../../Reusables/UIComponents/ujImageUpload.vue';
import ujSelect from '../../Reusables/UIComponents/ujSelect.vue';
import ujDatepicker from '../../Reusables/UIComponents/ujDatepicker.vue';
import ujInput from "../../Reusables/UIComponents/ujInput.vue";
import {reactive, ref} from "vue";

const formData = reactive({
    gceOL: [{}],
    gceAL: [{}],
    diploma: [{}],
    degree: [{}],
    masters: [{}],
    phd: [{}],
    specialResearch: [{}],
});


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
function addRepeatableItem(section) {
    formData[section].push({});
}

function removeRepeatableItem(section, index) {
    formData[section].splice(index, 1);
}

function updateRepeatableSection(section, index, value) {
    formData[section][index] = value;
}

function submitForm() {
    // Handle form submission here
}

</script>
<style scoped>

</style>
