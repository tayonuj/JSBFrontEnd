<template>
  <section class="cp-map-section">
    <div class="container">
      <div class="cp-map-card">
        <div class="cp-map-header">
          <h3>Map view – {{ districts.name }}</h3>
          <p>
            The map highlights beneficiaries and administrative boundaries
            related to Climate Promise 1.
          </p>
        </div>
        <div id="cp1-map" class="cp-map"></div>

        <p class="cp-map-footnote">
          This is a demonstration view. In production you can connect this
          panel directly to your GeoJSON layers and JSB database.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from "vue";
import {useCP1Map} from "./useCP1Map";

const props = defineProps<{
  districts: any[],
  selectedDistrict: string,
  selectedSubCategory: string,
  statsFor: Function,
  showBeneficiaries: boolean,
  showBoundaries: boolean
}>();

const currentDistrict = computed(() =>
    props.districts.find(d => d.id === props.selectedDistrict) || props.districts[0]
);

const { initMap, updateLayers } = useCP1Map(props, currentDistrict);

onMounted(() => {
  initMap();
});

watch(
    () => [
      props.selectedDistrict,
      props.selectedSubCategory,
      props.showBeneficiaries,
      props.showBoundaries
    ],
    () => updateLayers()
);
</script>
