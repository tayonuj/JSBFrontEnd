<script setup>
import {defineProps, defineEmits, ref, watch, computed, onMounted} from 'vue';
import useValidation from "../../../composables/application/UIComponents/validationRules";
import {useStore} from "vuex";

const store = useStore();
const props = defineProps({
    section: {type: String, default: 'main'},
    label: String,
    modelValue: String,
    type: {type: String, default: 'text'},
    size: {type: String, default: 'small'},
    required: Boolean,
    formSubmitted: Boolean,
    validationTypes: Array,
    isDisabled: {type: Boolean, default: false},
});

const {getValidationRules} = useValidation();
const emits = defineEmits(['update:modelValue']);
const propName = props.section+"_"+props.label;
//this phase is committing the errors to vuex to identify it later
const validationError = computed({
    get: () => store.state.validationErrors[propName] || '',
    set: (value) => {
        store.commit('setValidationError', { field: propName, message: value });
    }
});

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

// Re-validate when modelValue changes externally
watch(() => props.modelValue, () => validateInput(props.modelValue));
watch(() => props.formSubmitted, (value) => value?validateInput(props.modelValue):validationError.value = '');

</script>

<template>
    <div class="mb-3">
        <label class="form-label" >
            {{ label }}<span v-if="required" class="text-danger">*</span>
        </label>
        <input
            :type="type"
            class="form-control disabled"
            :class="{'form-control-sm': size === 'small', 'form-control-lg': size === 'large', 'is-invalid': validationError}"
            id="ujInput"
            :value="modelValue"
            @input="validateInput($event.target.value)"
            :disabled="isDisabled"
        >

<!--      <input-->
<!--          :type="type"-->
<!--          class="form-control"-->
<!--          :class="{'form-control-sm': size === 'small', 'form-control-lg': size === 'large', 'is-invalid': validationError}"-->
<!--          :value="modelValue"-->
<!--          @input="validateInput($event.target.value)"-->
<!--          :disabled="isDisabled"-->
<!--      >-->
        <div v-if="validationError" class="invalid-feedback">
            {{ validationError }}
        </div>
    </div>
</template>

<style scoped>
.text-danger {
    color: #dc3545 !important;
}

.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    display: block;
}
</style>
