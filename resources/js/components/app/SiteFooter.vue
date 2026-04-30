<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="container-fluid footer-wrap">
      <div class="footer-inner">
      <div class="footer-brand">
        <p class="footer-kicker">Japanese Supplementary Budget</p>
        <h2 class="footer-title">A shared platform for climate, food systems, and livelihood stories in Sri Lanka.</h2>
        <p class="footer-copy">
          Built to connect programme insights, project pages, and field stories
          in one clear experience.
        </p>
      </div>

      <nav class="footer-links" aria-label="Footer navigation">
        <router-link to="/" class="footer-link">Home</router-link>
        <router-link to="/blog" class="footer-link">Gallery</router-link>
        <router-link to="/contactus" class="footer-link">Contact</router-link>
        <router-link to="/climate/project/1" class="footer-link">Projects</router-link>
      </nav>
      </div>
    </div>

    <div class="container-fluid footer-wrap">
      <div class="footer-bar">
      <p>
        &copy; <span>{{ currentYear }}</span> G-Sentry (PVT) LTD. All rights reserved.
      </p>
      <p class="footer-note">
        Implemented with support from the <strong>UNDP Sri Lanka</strong>.
      </p>
      </div>
    </div>
  </footer>
</template>
