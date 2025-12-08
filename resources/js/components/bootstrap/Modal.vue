<template>
  <div class="modal fade" ref="detailModal" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg mt-6" role="document">
      <div class="modal-content border-0">
        <div class="modal-header p-0">
          <div class="position-absolute top-0 end-0 mt-3 me-3" style="z-index: 999">
            <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        </div>
        <div class="modal-body p-0">
          <div class="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
            <h4 class="mb-1" id="modalExampleDemoLabel">{{ title }}</h4>
          </div>
          <div class="me-3">
          <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
});

const detailModal = ref(null);
let modalInstance = null;

const showModal = () => {
  modalInstance.show();
};

const hideModal = () => {
  modalInstance.hide();
};

onMounted(() => {
  modalInstance = new Modal(detailModal.value);
});

onUnmounted(() => {
  if (modalInstance) {
    modalInstance.hide();
  }
});

defineExpose({
  showModal,
  hideModal
});
</script>

<style scoped>
</style>
