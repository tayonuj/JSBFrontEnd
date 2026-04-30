<template>
  <PublicShell>
    <div class="cp-page">
      <Cp3Hero @openMedia="openMediaSection" />

      <section class="jsb-panel jsb-panel--filters">
        <CP3Filters
            :districts="districts"
            :dashboard-mode="true"
            v-model:selectedDistricts="selectedDistricts"
            v-model:selectedFilters="selectedFilters"
            v-model:showBeneficiaries="showBeneficiaries"
            v-model:showBoundaries="showBoundaries"
        />
      </section>

      <CP3StatsCharts
          :districts="districts"
          :selectedDistricts="selectedDistricts"
          :selectedFilters="selectedFilters"
          :dsdChartData="dsdChartData"
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
import Cp3Hero from "./CP3Hero.vue";
import { useCP3Data } from "./useCP3Data";
import CP3Filters from "./CP3Filters.vue";
import CP3StatsCharts from "./CP3StatsCharts.vue";
import FoodSecurityMediaSection from "../FP1/FoodSecurityMediaSection.vue";

type MediaTab = "images" | "stories" | "videos";

const activeMediaTab = ref<MediaTab>("images");
const mediaSectionRef = ref<InstanceType<typeof FoodSecurityMediaSection> | null>(null);

const {
  districts,
  dsDivisions,
  selectedDistricts,
  selectedFilters,
  showBeneficiaries,
  showBoundaries,
  currentStats,
  statsFor,
  dsdChartData,
} = useCP3Data();

const openMediaSection = async (tab: MediaTab) => {
  activeMediaTab.value = tab;
  await nextTick();
  mediaSectionRef.value?.scrollToSection();
};
</script>
