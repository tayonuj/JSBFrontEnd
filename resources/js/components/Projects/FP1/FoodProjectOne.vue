<template>
  <PublicShell>
    <div class="cp-page">

      <FP1Hero @openMedia="openMediaSection" />

      <section class="jsb-panel jsb-panel--filters">
        <FP1Filters
          :districts="districts"
          :subCategories="subCategories"
          :dashboardMode="true"
          v-model:selectedDistricts="selectedDistricts"
          v-model:selectedSubCategory="selectedSubCategory"
          v-model:showBeneficiaries="showBeneficiaries"
          v-model:showBoundaries="showBoundaries"
        />
      </section>

      <FP1StatsCharts
        :districts="districts"
        :subCategories="subCategories"
        :selectedDistricts="selectedDistricts"
        :selectedSubCategory="selectedSubCategory"
        :statsFor="statsFor"
        :currentStats="currentStats"
        :showBeneficiaries="showBeneficiaries"
        :showBoundaries="showBoundaries"
      />

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
import FP1Hero from "./FP1Hero.vue";
import FP1Filters from "./FP1Filters.vue";
import FP1StatsCharts from "./FP1StatsCharts.vue";
import FoodSecurityMediaSection from "./FoodSecurityMediaSection.vue";
import { useFP1Data } from "./useFP1Data";

type MediaTab = "images" | "stories" | "videos";

const activeMediaTab = ref<MediaTab>("images");
const mediaSectionRef = ref<InstanceType<typeof FoodSecurityMediaSection> | null>(null);

const {
  districts,
  subCategories,
  selectedDistricts,
  selectedSubCategory,
  showBeneficiaries,
  showBoundaries,
  statsFor,
  currentStats
} = useFP1Data();

const openMediaSection = async (tab: MediaTab) => {
  activeMediaTab.value = tab;
  await nextTick();
  mediaSectionRef.value?.scrollToSection();
};
</script>
