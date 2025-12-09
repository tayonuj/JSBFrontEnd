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

        <!-- Progress bar (top of map) -->
        <div class="cp-progress-container" v-if="loadingProgress > 0">
          <div
              class="cp-progress-bar"
              :style="{ width: loadingProgress + '%' }"
          ></div>
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
  selectedDistricts: string[]; // multi-select
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

const { initMap, updateLayers, recenterOnDistricts, loadingProgress } =
    useCP1Map(props, primaryDistrict);

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
    () => [
      props.selectedSubCategory,
      props.showBeneficiaries,
      props.showBoundaries,
    ],
    () => {
      updateLayers();
    }
);
</script>

<style scoped>
.cp-map-section {
  padding: 1rem 0 0.5rem;
}

.cp-map-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 0.75rem 1rem 0.75rem;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cp-map-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cp-map-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.cp-map-header p {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
}

/* Progress bar styling */
.cp-progress-container {
  width: 100%;
  height: 4px;
  background: rgba(148, 163, 184, 0.2);
  margin-top: 6px;
  border-radius: 999px;
  overflow: hidden;
}

.cp-progress-bar {
  height: 4px;
  background: #ff8c00;
  transition: width 0.3s ease-in-out;
}

/* Map */
.cp-map {
  width: 100%;
  height: 620px;
  border-radius: 14px;
  overflow: hidden;
  margin-top: 8px;
}

.cp-map-footnote {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0.3rem 0 0;
}
</style>
