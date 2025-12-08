<script setup>
import {defineProps, defineEmits, watch, ref, computed} from 'vue';
import useValidation from "../../../composables/application/UIComponents/validationRules";
import {useStore} from "vuex";
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const props = defineProps({
    section: {type: String, default: 'main'},
    label: String,
    modelValue: String,
    required: Boolean,
    items: Array,
    formSubmitted: Boolean,
    validationTypes: Array,
    isMultiple:{type: Boolean, default: false},
});
const {getValidationRules} = useValidation();
const emits = defineEmits(['update:modelValue']);
const propName = props.section+"_"+props.label;
const store = useStore();
const validationError = computed({
    get: () => store.state.validationErrors[propName] || '',
    set: (value) => {
        store.commit('setValidationError', { field: propName, message: value });
    }
});
const localModelValue = ref(props.modelValue);
// Function to validate the selected value
const validateInput = value => {
    emits('update:modelValue', value);
    validationError.value = '';
    const rules = getValidationRules(props.validationTypes || []);

    for (const rule of rules) {
        const validationResult = rule(value);
        if (validationResult !== true) {
            validationError.value = validationResult;
            break;
        }
    }

};
// Watch for changes in modelValue prop to validate externally changed values
watch(() => props.modelValue, (newValue) => {
    validateInput(newValue);
    localModelValue.value = newValue;
    emits('update:modelValue', newValue);
});
watch(() => props.formSubmitted, (value) => value?validateInput(props.modelValue):validationError.value = '');

const updated = (value) => {
    // console.log("fucking upd data",value)
    // const value = event.target.value;
    emits('update:modelValue', value);
    validateInput(value);
};
</script>

<template>
    <div class="mb-3">
        <label class="form-label" for="filterAttr">
            {{ label }}<span v-if="required" class="text-danger">*</span>
        </label>
<!--        <select v-model="localModelValue" @change="updated" class="form-select" id="filterAttr" :class="{'is-invalid': validationError}">-->
<!--            <option disabled value="">Please select one</option>-->
<!--            <option v-for="item in items" :key="item" :value="item">{{ item }}</option>-->
<!--        </select>-->
        <v-select
            id="filterAttr"
            :options="items"
            :class="{'is-invalid': validationError}"
            :multiple="isMultiple"
             v-model="localModelValue"
            @option:selected="updated"
        ></v-select>
        <div v-if="validationError" class="invalid-feedback">
            {{ validationError }}
        </div>
    </div>
</template>

<style scoped>
::v-deep .is-invalid .vs__dropdown-toggle {
    border-color: #dc3545 !important;
}
.is-invalid {
    border-color: #dc3545;
}
.invalid-feedback {
    display: block;
}
</style>
