<template>
  <main class="main" id="top" v-if="!isLoginPage">
    <div class="container-fluid" data-layout="container-fluid">
      <TopbarNav />

      <!-- Landing / project / GIS pages -->
      <router-view></router-view>

      <SiteFooter />
    </div>
  </main>

  <main v-else class="main" id="top">
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { computed, watch } from "vue";
import TopbarNav from "./app/TopbarNav.vue";
import SiteFooter from "./app/SiteFooter.vue";

// if your CSS is in public/css/styles.css you can keep the link tag
// in welcome.blade; otherwise you can also import here:
// import "../assets/css/styles.css";

const route = useRoute();
const isLoginPage = computed(() => route.path === "/login");

// keep your body[data-page="..."] for animations from styles.css
const updateBodyPageAttr = () => {
  const pageKey = (route.meta.page as string) || "";
  if (pageKey) {
    document.body.setAttribute("data-page", pageKey);
  } else {
    document.body.removeAttribute("data-page");
  }
};

updateBodyPageAttr();
watch(
    () => route.fullPath,
    () => updateBodyPageAttr()
);
</script>
