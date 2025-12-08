
<template>
  <div class="card overflow-hidden">
    <div class="card-img-top">
      <img class="img-fluid" :src="imageSrc" :alt="imageAlt" />
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p
          class="card-text"
          @click="toggleCollapse"
          data-bs-toggle="collapse"
          :href="`#collapse-${id}`"
          role="button"
          aria-expanded="false"
          :aria-controls="`collapse-${id}`"
          style="cursor: pointer;"
      >
        {{ isCollapsed ? previewText : text }}
      </p>
      <!-- Full text collapse -->
      <div :id="`collapse-${id}`" class="collapse" v-if="isCollapsed"></div>

<!--      <a :href="linkHref" class="btn btn-primary btn-sm">{{ linkText }}</a>-->
      <button @click="handleReadMore" class="btn btn-primary btn-sm custom-font-size">{{ linkText }}</button>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";

// Props for the component
const props = defineProps({
  imageSrc: { type: String, required: true },
  imageAlt: { type: String, default: 'Card image' },
  title: { type: String, required: true },
  text: { type: String, required: true },
  linkText: { type: String, required: true },
  linkHref: { type: String, required: true },
  modelText: { type: Array, required: true },
  id: { type: [String, Number], required: true }
});
const emit = defineEmits(['read-more']);
// State to track collapse status
const isCollapsed = ref(true);

// Compute a preview of the text (limit to 100 characters)
const previewText = computed(() => {
  return props.text.length > 50 ? props.text.substring(0, 50) + '...' : props.text;
});

// Toggle collapse state
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Emit read-more event with card details
const handleReadMore = () => {
  emit('read-more', {
    title: props.title,
    text: props.modelText.join(' '),
  });
};
</script>

<style scoped>
.card-title {
  font-size: 18px;
}

.card-text {
  font-size: 12px;
  font-family: 'Arial', sans-serif;
  cursor: pointer;
}
.custom-font-size {
  font-size: 12px;
}
</style>