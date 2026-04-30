<template>
  <PublicShell>
    <div class="cp-page">
      <CP5Hero @openMedia="openMediaSection" />

      <section class="jsb-panel cp5-status-panel">
        <div class="cp5-status-panel__copy">
          <span class="cp5-status-panel__kicker">Temporary layout</span>
          <h2>CP5 is using the food project media block for now</h2>
          <p>
            This page is intentionally lightweight until the final Climate Promise 5 content, filters, and dashboards are ready. The gallery, stories, and video section below is the temporary shared version requested for this project.
          </p>
        </div>
      </section>

      <FoodSecurityMediaSection
        ref="mediaSectionRef"
        v-model:activeTab="activeMediaTab"
      />
    </div>
  </PublicShell>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import PublicShell from "../../Landing/PublicShell.vue";
import FoodSecurityMediaSection from "../FP1/FoodSecurityMediaSection.vue";
import CP5Hero from "./CP5Hero.vue";

type MediaTab = "images" | "stories" | "videos";

const activeMediaTab = ref<MediaTab>("images");
const mediaSectionRef = ref<InstanceType<typeof FoodSecurityMediaSection> | null>(null);

const openMediaSection = async (tab: MediaTab) => {
  activeMediaTab.value = tab;
  await nextTick();
  mediaSectionRef.value?.scrollToSection();
};
</script>

<style scoped>
.cp5-status-panel {
  padding: clamp(1.4rem, 3vw, 2.2rem);
}

.cp5-status-panel__copy {
  max-width: 48rem;
}

.cp5-status-panel__kicker {
  display: inline-flex;
  margin-bottom: 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #1c63d6;
}

.cp5-status-panel h2 {
  margin: 0;
  color: #12233f;
}

.cp5-status-panel p {
  margin: 0.9rem 0 0;
  color: #5f6f8a;
  line-height: 1.7;
}
</style>
