<template>
  <div class="cp-page">
    <Cp4Hero />

    <CP4Filters
        :districts="districts"
        :sub-categories="subCategories"
        v-model:selectedDistricts="selectedDistricts"
        v-model:selectedSubCategory="selectedSubCategory"
        v-model:selectedSubCategoryOption="selectedSubCategoryOption"
        v-model:showBeneficiaries="showBeneficiaries"
        v-model:showBoundaries="showBoundaries"
    />

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
  </div>
</template>

<script setup lang="ts">
import Cp4Hero from "./CP4Hero.vue";
import { useCP4Data } from "./useCP4Data";
import CP4Filters from "./CP4Filters.vue";
import CP4StatsCharts from "./CP4StatsCharts.vue";

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
</script>
