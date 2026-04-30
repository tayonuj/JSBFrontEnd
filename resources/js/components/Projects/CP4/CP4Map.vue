<template>
  <section ref="mapSectionRef" class="cp-map-section">
    <div class="cp-map-card" :class="{ 'cp-map-card--embedded': embedded }">
      <div v-if="!embedded" class="cp-map-header">
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, computed, nextTick, ref } from "vue";
import { useCP4Map } from "./useCP4Map";

const props = defineProps<{
  districts: any[];
  subCategories: any[];
  selectedDistricts: string[];
  selectedSubCategory: string;
  selectedSubCategoryOption: string;
  statsFor: Function;
  showBeneficiaries: boolean;
  showBoundaries: boolean;
  embedded?: boolean;
}>();

const embedded = computed(() => !!props.embedded);

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

const mapSectionRef = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver | null = null;

const { initMap, updateLayers, recenterOnDistricts, loadingProgress, refreshSize } =
    useCP4Map(props, primaryDistrict);

onMounted(() => {
  initMap();
  nextTick(() => {
    refreshSize();
    updateLayers();
  });

  if (window.ResizeObserver && mapSectionRef.value) {
    resizeObserver = new ResizeObserver(() => {
      refreshSize();
    });
    resizeObserver.observe(mapSectionRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

watch(
    () => props.selectedDistricts.slice(),
    () => {
      recenterOnDistricts();
      updateLayers();
    }
);

watch(
    () => [
      props.selectedSubCategory,
      props.selectedSubCategoryOption,
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
  min-width: 0;
  height: 100%;
}

.cp-map-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(245, 248, 252, 0.98) 100%);
  border-radius: 18px;
  padding: 0.75rem 1rem 0.75rem;
  border: 1px solid rgba(16, 24, 40, 0.06);
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  height: 100%;
}

.cp-map-card--embedded {
  background: transparent;
  border: 0;
  box-shadow: none;
  padding: 0;
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
  color: #12233f;
}

.cp-map-header p {
  margin: 0;
  font-size: 0.82rem;
  color: #6a7487;
}

/* Progress bar styling */
.cp-progress-container {
  width: 100%;
  height: 4px;
  background: rgba(42, 123, 243, 0.1);
  margin-top: 6px;
  border-radius: 999px;
  overflow: hidden;
}

.cp-progress-bar {
  height: 4px;
  background: linear-gradient(90deg, #69c7ff, #2b93e0);
  transition: width 0.3s ease-in-out;
}

/* Map */
.cp-map {
  width: 100%;
  max-width: 100%;
  flex: 1 1 auto;
  min-height: 320px;
  border-radius: 14px;
  overflow: hidden;
  margin-top: 8px;
}

@media (max-width: 1024px) {
  .cp-map-section,
  .cp-map-card {
    height: auto;
  }

  .cp-map {
    flex: none;
    height: 260px;
    min-height: 260px;
  }
}
</style>
