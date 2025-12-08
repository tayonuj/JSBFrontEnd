
<template>
    <div>
        <div>
            <div v-for="(section, sectionIndex) in formConfig" :key="sectionIndex">
                <div v-if="section.repeatable">
                    <div v-for="(item, itemIndex) in formData[section.section]" :key="`item-${itemIndex}`">
                        <RepeatableFormComponent :formFields="section.fields" :modelValue="item" @update:modelValue="updateRepeatableSection(section.section, itemIndex, $event)" />
                    </div>
                </div>
            </div>
        </div>
        <button @click="submitForm">Submit</button>
    </div>
</template>

<script setup>
import RepeatableFormComponent from "./CustomForms/RepeatableFormComponent.vue";
import formConfig from "./configs/secondLanguages.json";
import ujImageUpload from '../../Reusables/UIComponents/ujImageUpload.vue';
import ujSelect from '../../Reusables/UIComponents/ujSelect.vue';
import ujDatepicker from '../../Reusables/UIComponents/ujDatepicker.vue';
import ujInput from "../../Reusables/UIComponents/ujInput.vue";
import {reactive, ref} from "vue";

const formData = reactive({
    secondLanguage: [{}]
});


const components = {
    ujImageUpload,
    ujSelect,
    ujDatepicker,
    ujInput
};


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
