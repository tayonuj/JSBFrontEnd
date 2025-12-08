<template>
  <div class="modal fade show-animation" tabindex="-1" ref="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
      <div class="modal-content">
        <Card >
          <div class="bg-holder bg-card" :style="{ backgroundImage: `url(/assets/img/icons/spot-illustrations/corner-5.png)` }"></div>

          <div class="modal-header">
            <h6 class="modal-title" id="exampleModalLabel">{{ title }}</h6>
            <button type="button" style="z-index: 9999999" class="btn-close" @click="closeModal" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer" style="z-index: 9999999">
            <button type="button" class="btn btn-outline-primary btn-sm" @click="onConfirm">Yes</button>
            <button type="button" class="btn btn-outline-danger btn-sm ms-2" @click="onCancel">No</button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps(['message', 'title', 'resolve', 'onCleanup']);
const dialog = ref(null);
let modalInstance = null;

const showModal = () => {
  modalInstance = new Modal(dialog.value);
  modalInstance.show();
  console.log("previewd", modalInstance);
}

const closeModal = () => {
  modalInstance.hide();
  if (props.onCleanup) {
    props.onCleanup();
  }
};

const onConfirm = () => {
  props.resolve(true);
  closeModal();
};

const onCancel = () => {
  props.resolve(false);
  closeModal();
};

onMounted(() => {
  showModal();
});
</script>

<style scoped>
.modal.static-modal {
  background: transparent;
}

.modal-dialog {
  transition: transform 0.3s ease-out;
}

.show-animation .modal-dialog {
  transform: translateY(0);
}

.modal-dialog {
  transform: translateY(-50%);
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}
</style>
