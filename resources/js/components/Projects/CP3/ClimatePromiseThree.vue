<template>
  <div class="cp-page">
    <Cp3Hero />

    <CP3Filters
        :districts="districts"
        :sub-categories="subCategories"
        v-model:selectedDistricts="selectedDistricts"
        v-model:selectedSubCategory="selectedSubCategory"
        v-model:selectedSubCategoryOption="selectedSubCategoryOption"
        v-model:showBeneficiaries="showBeneficiaries"
        v-model:showBoundaries="showBoundaries"
    />

    <CP3StatsCharts
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
  </div>
</template>

<script setup lang="ts">
import Cp3Hero from "./CP3Hero.vue";
import { useCP3Data } from "./useCP3Data";
import CP3Filters from "./CP3Filters.vue";
import CP3StatsCharts from "./CP3StatsCharts.vue";

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
} = useCP3Data();
</script>
