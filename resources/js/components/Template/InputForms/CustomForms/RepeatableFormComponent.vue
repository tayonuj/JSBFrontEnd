<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <div class="row">
                <div v-for="(field, index) in formFields" :key="index" class="col-md-3">
                    <div v-if="isFieldVisible(field)">
                        <component
                            :is="components[field.component]"
                            v-model="formData[field.model]"
                            :label="field.label"
                            :items="field.items || []"
                            :validationTypes="field.validationTypes"
                            :options="field.options || []"
                            :placeholder="field.placeholder"
                            :bucketMainSection="field.bucketMainSection"
                            :bucketSubSection="field.bucketSubSection"
                            :formSubmitted="formSubmitted"
                            :minDate="getDates(field,section,'min_date',formData)"
                            :maxDate="getDates(field,section,'max_date',formData)"
                            :section="section"
                            :required="field.required"
                            @update:modelValue="value => formData[field.model] = value"
                        ></component>
                    </div>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-outline-theme  mt-4" type="submit">Add to List</button>
                </div>
            </div>


        </form>

        <!-- Table to display items -->
        <table class="table table-striped">
            <thead>
            <tr>
                <th v-for="(field, index) in formFields" :key="`header-${index}`">{{ field.label }}</th>
                <th>Remove</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in itemsList" :key="`item-${index}`">
                <td v-for="field in formFields" :key="`data-${field.model}-${index}`">
                    <a v-if="field.component === 'ujFileUpload' && item[field.model]" :href="'https://services.misgovernance.lk/storage/gcp/readBucketFile?path='+item[field.model]" target="_blank">{{ field.label }}</a>
                    <span v-else-if="!item[field.model] || item[field.model] === ''"></span>
                    <span v-else>{{ item[field.model] }}</span>
                </td>
                <td>
                    <button class="btn btn-outline-danger btn-sm" @click="removeItem(index)">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import {ref, computed, reactive} from 'vue';
import ujImageUpload from '../../../Reusables/UIComponents/ujImageUpload.vue';
import ujFileUpload from '../../../Reusables/UIComponents/ujFileUpload.vue';
import ujSelect from '../../../Reusables/UIComponents/ujSelect.vue';
import ujDatepicker from '../../../Reusables/UIComponents/ujDatepicker.vue';
import ujInput from "../../../Reusables/UIComponents/ujInput.vue";
import notificationHandling from "../../../../composables/application/notificationHandling";
import {useStore} from "vuex";
import {getDates} from "../../../../composables/application/UIComponents/generalConfigurations";

const props = defineProps({
    formFields: Array,
    items: Array,
    section:String,
    relationShip:String,
});

const emits = defineEmits(['update:items']);
const store = useStore();
const formData = reactive({});
const itemsList = ref([]);
const formSubmitted = ref(false);
const components = {
    ujImageUpload,
    ujSelect,
    ujDatepicker,
    ujInput,
    ujFileUpload
};
const isFieldVisible = (field) => {
    if (!field.condition) return true;
    return new Function('formData', `return ${field.condition};`)(formData);
}
const handleSubmit = () => {
    formSubmitted.value = true
    setTimeout(async function () {
        if (store.getters.hasValidationErrors) {
            notificationHandling('error', 'Please resolve the errors before submitting!')
        } else {
            formData[props.relationShip] = props.section;
            itemsList.value.push({...formData});
            emits('update:items', itemsList.value);
            // Reset form data by looping through each key and setting it to an initial value
            Object.keys(formData).forEach(key => {
                formData[key] = '';
            });
            // store.commit('clearValidationErrors');
            formSubmitted.value = false
        }
    },500);

};

const removeItem = (index) => {
    itemsList.value.splice(index, 1);
    emits('update:items', itemsList.value);
};
</script>
<style scoped>
th {
    font-size: x-small;
}
td {
    font-size: x-small;
}
</style>
