<script setup>
import {defineProps, defineEmits, ref, watch, onMounted, computed} from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import useValidation from "../../../composables/application/UIComponents/validationRules";
import {useStore} from "vuex";

const props = defineProps({
    label: String,
    modelValue: Date,
    required: Boolean,
    formSubmitted: Boolean,
    validationTypes: Array,
    type:{type:String,default:'Date'},
    format:{type:String},
    minDate:{default:null},
    minTime:{default:null},
    maxDate:{default:null},
    maxTime:{default:null},
    markers:{type:Array,default:[]},
    minuteIncrement:{type:String,default:1},
});
// const {getValidationRules} = useValidation();
const emits = defineEmits(['update:modelValue']);

const store = useStore();
const validationError = computed({
    get: () => store.state.validationErrors[props.label] || '',
    set: (value) => {
        store.commit('setValidationError', { field: props.label, message: value });
    }
});
const {getValidationRules} = useValidation();
const localModelValue = ref(props.modelValue);
// Function to validate the selected date
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
onMounted(() => {
    if (props.modelValue && !(props.modelValue instanceof Date)) {
        // If modelValue is not a Date instance, parse or transform it here
        validateInput(new Date(props.modelValue)); // Example: parsing string to Date
    }
});
// Watch for changes in modelValue prop to validate externally changed values
watch(() => props.modelValue, (newValue) => {
    localModelValue.value = newValue;
    // validateInput(newValue);
    let date = new Date(newValue);
    // date = format(date);
    emits('update:modelValue', newValue);
});
watch(() => props.formSubmitted, (value) => value?validateInput(props.modelValue):validationError.value = '');
const updated = (value) => {
    emits('update:modelValue', value);
    // validateInput(value);
};

// const format = (date) => {
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//
//     return `${year}-${month}-${day}`;
// }
</script>

<template>
    <div class="mb-3">
        <label for="ujDatepicker" class="form-label">
            {{ label }}<span v-if="required" class="text-danger">*</span>
        </label>
        <Datepicker
            id="ujDatepicker"
            v-model="localModelValue"
            @update:modelValue="updated"
            :class="{'is-invalid': validationError}"
            placeholder="Select date..."
            :enable-time-picker="!!(type && type === 'time')"
            :time-picker="!!(type && type === 'time')"
            :type="type"
            :autoApply="type !== 'time'"
            :format="format"
            :min-date="minDate"
            :min-time="minTime"
            :max-date="maxDate"
            :max-time="maxTime"
            :markers="markers"
            :minutes-increment="minuteIncrement"
            >
          <template #marker-tooltip="{ tooltip, day }">
            <div>{{ tooltip?tooltip.text:'holiday on '+day }}</div>
          </template>
        </Datepicker>
        <div v-if="validationError" class="invalid-feedback">
            {{ validationError }}
        </div>
    </div>
</template>

<style scoped>
.text-danger {
    color: #dc3545;
}
.is-invalid .vue-datepicker__input {
    border-color: #dc3545;
}
.invalid-feedback {
    display: block;
}
</style>
