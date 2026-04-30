<template>
  <PublicShell>
    <div class="cp-page">

      <CP1Hero @openMedia="openMediaSection" />

      <section class="jsb-panel jsb-panel--filters">
        <CP1Filters
          :districts="districts"
          :subCategories="subCategories"
          :dashboardMode="true"
          v-model:selectedDistricts="selectedDistricts"
          v-model:selectedSubCategory="selectedSubCategory"
          v-model:showBeneficiaries="showBeneficiaries"
          v-model:showBoundaries="showBoundaries"
        />
      </section>

      <CP1StatsCharts
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
import CP1Hero from "./CP1Hero.vue";
import CP1Filters from "./CP1Filters.vue";
import CP1StatsCharts from "./CP1StatsCharts.vue";
import FoodSecurityMediaSection from "./FoodSecurityMediaSection.vue";
import { useCP1Data } from "./useCP1Data";

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
} = useCP1Data();

const openMediaSection = async (tab: MediaTab) => {
  activeMediaTab.value = tab;
  await nextTick();
  mediaSectionRef.value?.scrollToSection();
};
</script>
