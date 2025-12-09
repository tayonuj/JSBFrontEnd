<template>
  <section class="cp-map-section">
    <div class="container">
      <div class="cp-map-card">
        <div class="cp-map-header">
          <h3>Map view – {{ districtLabel }}</h3>
          <p>
            The map highlights beneficiaries and administrative boundaries
            related to Climate Promise 1 for the selected district(s).
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
import { useCP1Map } from "./useCP1Map";

const props = defineProps<{
  districts: any[];
  selectedDistricts: string[];  // multi-select
  selectedSubCategory: string;
  statsFor: Function;
  showBeneficiaries: boolean;
  showBoundaries: boolean;
}>();

const primaryDistrict = computed(() => {
  const ids = props.selectedDistricts || [];
  if (ids.length) {
    const found = props.districts.find((d) => d.id === ids[0]);
    if (found) return found;
  }
  return props.districts[0];
});

const districtLabel = computed(() => {
  const ids = props.selectedDistricts || [];
  if (!ids.length) return "All districts";
  if (ids.length === 1) {
    const d = props.districts.find((x) => x.id === ids[0]);
    return d?.name ?? "Selected district";
  }
  return "Multiple districts";
});

const { initMap, updateLayers, recenterOnDistricts } = useCP1Map(
    props,
    primaryDistrict
);

onMounted(() => {
  initMap();
  updateLayers();
});

// When district selection changes → pan + update layers
watch(
    () => props.selectedDistricts.slice(),
    () => {
      recenterOnDistricts();
      updateLayers();
    }
);

// Other filter changes → just refresh layers
watch(
    () => [props.selectedSubCategory, props.showBeneficiaries, props.showBoundaries],
    () => {
      updateLayers();
    }
);
</script>

