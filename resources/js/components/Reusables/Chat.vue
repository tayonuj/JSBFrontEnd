<script lang="ts" setup>
// App.vue
import { onMounted } from 'vue';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

onMounted(() => {
  createChat({
    webhookUrl: 'https://shia.logifortech.com/webhook/6f0ca8e3-3b24-49dc-a313-e560186e3af0/chat'
  });
});
</script>
<template>
  <div></div>
</template>
