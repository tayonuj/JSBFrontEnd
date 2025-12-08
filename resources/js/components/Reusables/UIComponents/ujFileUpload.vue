<template>
    <div class="file-upload-wrapper mb-3">
        <label for="ujFileUpload" class="form-label">
            {{ label }}<span v-if="required" class="text-danger">*</span>
        </label>
        <div v-if="uploadedFileUrl">
            <a :href="'https://services.misgovernance.lk/storage/gcp/readBucketFile?path='+uploadedFileUrl" target="_blank">{{ label }}</a>
            &nbsp;&nbsp; <a href="#" @click="removeUploadedFile" style="color:darkred">Remove</a>

        </div>
        <input v-if="!uploadedFileUrl" class="form-control" type="file" id="ujFileUpload" @change="handleFileChange"  />
<!--        <button v-if="!uploadedFileUrl" type="button" class="btn btn-primary" @click="triggerFileInput">Upload Image</button>-->
    </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import axios from 'axios';
import {useStore} from "vuex";
import useValidation from "../../../composables/application/UIComponents/validationRules";
import {useProgress} from "@marcoschulte/vue3-progress";
import notificationHandling from "../../../composables/application/notificationHandling"; // Make sure to install and import axios

const props = defineProps({
    label: String,
    required: Boolean,
    formSubmitted: Boolean,
    validationTypes: Array,
    bucketMainSection:{type:String,default:'N_A'},
    bucketSubSection:{type:String,default:'N_A'},
});

const emits = defineEmits(['update:modelValue']);

const store = useStore();
const validationError = computed({
    get: () => store.state.validationErrors[props.label] || '',
    set: (value) => {
        store.commit('setValidationError', { field: props.label, message: value });
    }
});
const {getValidationRules} = useValidation();

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
const uploadedFileUrl = ref('');
const uploadedFileName = ref('');

const triggerFileInput = () => {
    document.getElementById('ujFileUpload').click();
};

const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('main_section', props.bucketMainSection);
        formData.append('sub_section', props.bucketSubSection);
        formData.append('file', file);
        const progress = useProgress().start();
        try {
            await axios.post('https://services.misgovernance.lk/api/v1/fileManager/store', formData)
                .then((response) => {
                    if (response.data && response.data.data){
                        // notificationHandling('success',response.data.data);
                        uploadedFileUrl.value = response.data.data
                        emits('update:modelValue', response.data.data);
                    }else{
                        notificationHandling("error","Cannot upload file")
                    }
                    progress.finish();
                })
                .catch((error) => {
                    progress.finish();
                    notificationHandling("error",error.message);
                });
            uploadedFileName.value = file.name;

        } catch (error) {
            progress.finish();
            console.error('Upload failed:', error);
        }
    }
};

const removeUploadedFile = () => {
    uploadedFileUrl.value = '';
    uploadedFileName.value = '';
    emits('update:modelValue', '');
};

watch(() => props.formSubmitted, (value) => value?validateInput(props.modelValue):validationError.value = '');
</script>

<style scoped>
.file-upload-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
}

.file-preview {
    max-width: 50px;
    max-height: 50px;
}

.change-text {
    text-decoration: underline;
}
</style>
