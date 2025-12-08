<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <p>
        &copy; <span>{{ currentYear }}</span> G-Sentry (PVT) LTD. All rights reserved.
      </p>
      <p class="footer-note">
        Implemented with support from the <strong>UNDP Srilanka</strong>.
      </p>
    </div>
  </footer>
</template>
