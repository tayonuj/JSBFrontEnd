<template>
  <PublicShell>
    <div class="cp-page">
      <Cp4Hero @openMedia="openMediaSection" />

      <section class="jsb-panel jsb-panel--filters">
        <CP4Filters
          :districts="districts"
          :sub-categories="subCategories"
          :dashboard-mode="true"
          v-model:selectedDistricts="selectedDistricts"
          v-model:selectedSubCategory="selectedSubCategory"
          v-model:selectedSubCategoryOption="selectedSubCategoryOption"
          v-model:showBeneficiaries="showBeneficiaries"
          v-model:showBoundaries="showBoundaries"
        />
      </section>

      <CP4StatsCharts
        :districts="districts"
        :subCategories="subCategories"
        :selectedDistricts="selectedDistricts"
        :selectedSubCategory="selectedSubCategory"
        :selectedSubCategoryOption="selectedSubCategoryOption"
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
import Cp4Hero from "./CP4Hero.vue";
import { useCP4Data } from "./useCP4Data";
import CP4Filters from "./CP4Filters.vue";
import CP4StatsCharts from "./CP4StatsCharts.vue";
import FoodSecurityMediaSection from "../FP1/FoodSecurityMediaSection.vue";

type MediaTab = "images" | "stories" | "videos";

const activeMediaTab = ref<MediaTab>("images");
const mediaSectionRef = ref<InstanceType<typeof FoodSecurityMediaSection> | null>(null);

const {
  districts,
  dsDivisions,
  subCategories,
  selectedDistricts,
  selectedSubCategory,
  selectedSubCategoryOption,
  showBeneficiaries,
  showBoundaries,
  currentStats,
  statsFor
} = useCP4Data();

const openMediaSection = async (tab: MediaTab) => {
  activeMediaTab.value = tab;
  await nextTick();
  mediaSectionRef.value?.scrollToSection();
};
</script>
