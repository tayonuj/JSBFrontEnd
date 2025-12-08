<template>
    <div class="image-upload-wrapper mb-3">
        <label for="ujImageUpload" class="form-label">
            {{ label }}<span v-if="required" class="text-danger">*</span>
        </label>
        <div v-if="imageUrl" class="image-preview row">
            <div class="col-5">
                <img :src="imageUrl" alt="Preview" class="img-thumbnail" @click="triggerFileInput" style="cursor: pointer;" />
            </div>
            <div class="col-7">
                <p class="change-text mt-2" @click="triggerFileInput" style="cursor: pointer; color: #007bff;">Change</p>
            </div>
        </div>
        <input type="file" id="ujImageUpload" @change="handleFileChange" style="display: none;" />
        <button v-if="!imageUrl" type="button" class="btn btn-outline-theme" @click="triggerFileInput">Upload Image</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    label: String,
    required: Boolean,
});

const emits = defineEmits(['update:modelValue']);
const imageFile = ref(null);
const imageUrl = ref('');

const triggerFileInput = () => {
    document.getElementById('ujImageUpload').click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        imageFile.value = file;
        imageUrl.value = URL.createObjectURL(file);
        emits('update:modelValue', file);
    }
    // emits('update:modelValue', file);
};
</script>

<style scoped>
.image-upload-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
}

.image-preview img {
    max-width: 50px;
    max-height: 50px;
}

.change-text {
    text-decoration: underline;
}
</style>
