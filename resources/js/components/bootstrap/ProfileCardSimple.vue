<template>
  <div
      :class="['card overflow-hidden d-flex align-items-start p-2 interactive-card', { 'selected-card': isSelected }]"
      @click="handleClick(employee)"
  >
    <div class="bg-holder bg-card" :style="{ backgroundImage: `url(/assets/img/icons/spot-illustrations/corner-2.png)` }"></div>
    <div class="row g-3">
      <div class="col-sm-12 col-md-3">
        <div class="avatar avatar-2xl">
          <img
              :src="`http://hris.slpa.lk/EHRM_SLPA/EmpImages/${employee.EMP_NUMBER}.JPG`"
              alt=""
          />
        </div>
      </div>
      <div class="col-sm-12 col-md-9">
        <span>{{ employee.MIDDLE_INI }} &nbsp; {{ employee.SURNAME }} <br /></span>
        <span style="font-size: small">{{ employee.designation }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  employee: {
    type: Object,
    required: false,
    default: {}
  },
  clickEvent: {
    type: String,
    required: false,
    default: 'gotoprofile'
  },
  isSelected: {
    type: Boolean,
    required: true,
    default: false
  },
  keyNum:Number
});

const emits = defineEmits(['profileclicked']);

const handleClick = (employee) => {
  if (props.clickEvent === 'gotoprofile') {
    window.open('employee-profile/' + employee.EMP_NUMBER, '_blank');
  } else {
    emits('profileclicked', {employee:employee,key:props.keyNum});
  }
};
</script>

<style scoped>
.interactive-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.interactive-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.link-decoration-none {
  text-decoration: none;
}

.profile-card-content {
  background-image: url('/assets/img/icons/spot-illustrations/corner-2.png');
  background-repeat: no-repeat;
  background-position: right bottom;
}

.selected-card {
  border: 2px solid #007bff;
  background-color: #e7f1ff;
}
</style>
