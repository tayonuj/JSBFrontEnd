<template>
  <div class="cp-page">

    <CP1Hero />

    <CP1Filters
        :districts="districts"
        :subCategories="subCategories"
        v-model:selectedDistrict="selectedDistrict"
        v-model:selectedSubCategory="selectedSubCategory"
        v-model:showBeneficiaries="showBeneficiaries"
        v-model:showBoundaries="showBoundaries"
    />

    <CP1StatsCharts
        :districts="districts"
        :subCategories="subCategories"
        :selectedDistrict="selectedDistrict"
        :selectedSubCategory="selectedSubCategory"
        :statsFor="statsFor"
        :currentStats="currentStats"
        :showBeneficiaries="showBeneficiaries"
        :showBoundaries="showBoundaries"
    />




  </div>
</template>

<script setup lang="ts">


import CP1Hero from "./CP1Hero.vue";
import CP1Filters from "./CP1Filters.vue";
import CP1StatsCharts from "./CP1StatsCharts.vue";
import {useCP1Data} from "./useCP1Data";

const {
  districts,
  subCategories,
  selectedDistrict,
  selectedSubCategory,
  showBeneficiaries,
  showBoundaries,
  statsFor,
  currentStats
} = useCP1Data();
</script>
