<template>
  <PublicShell>
    <div class="cp-page">
      <CP2Hero @openMedia="openMediaSection" />

      <section class="jsb-panel jsb-panel--filters">
        <CP4Filters
          :districts="districts"
          :project-input-options="projectInputOptions"
          :gender-options="genderOptions"
          :system-hp-options="systemHpOptions"
          :show-system-hp-filter="showSystemHpFilter"
          :dashboard-mode="true"
          v-model:selectedDistricts="selectedDistricts"
          v-model:selectedProjectInput="selectedProjectInput"
          v-model:selectedGender="selectedGender"
          v-model:selectedSystemHp="selectedSystemHp"
          v-model:showBeneficiaries="showBeneficiaries"
          v-model:showBoundaries="showBoundaries"
        />
      </section>

      <CP2StatsCharts
        :districts="districts"
        :projectInputOptions="projectInputOptions"
        :selectedDistricts="selectedDistricts"
        :selectedProjectInput="selectedProjectInput"
        :selectedGender="selectedGender"
        :selectedSystemHp="selectedSystemHp"
        :showSystemHpFilter="showSystemHpFilter"
        :statsFor="statsFor"
        :currentStats="currentStats"
        :showBeneficiaries="showBeneficiaries"
        :showBoundaries="showBoundaries"
      />

      <ClimatePromiseTwoMediaSection
        ref="mediaSectionRef"
        v-model:activeTab="activeMediaTab"
      />
    </div>
  </PublicShell>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import PublicShell from "../../Landing/PublicShell.vue";
import CP2Hero from "./CP2Hero.vue";
import { useCP2Data } from "./useCP2Data";
import CP4Filters from "./CP4Filters.vue";
import CP2StatsCharts from "./CP2StatsCharts.vue";
import ClimatePromiseTwoMediaSection from "./ClimatePromiseTwoMediaSection.vue";

type MediaTab = "images" | "stories" | "videos";

const activeMediaTab = ref<MediaTab>("images");
const mediaSectionRef = ref<InstanceType<typeof ClimatePromiseTwoMediaSection> | null>(null);

const {
  districts,
  projectInputOptions,
  genderOptions,
  systemHpOptions,
  selectedDistricts,
  selectedProjectInput,
  selectedGender,
  selectedSystemHp,
  showSystemHpFilter,
  showBeneficiaries,
  showBoundaries,
  currentStats,
  statsFor
} = useCP2Data();

const openMediaSection = async (tab: MediaTab) => {
  activeMediaTab.value = tab;
  await nextTick();
  mediaSectionRef.value?.scrollToSection();
};
</script>
