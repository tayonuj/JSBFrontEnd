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
import { useCP1Map } from "./useCP1Map";

const props = defineProps<{
  districts: any[];
  selectedDistricts: string[]; // multi-select
  selectedSubCategory: string;
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

const {
  initMap,
  updateLayers,
  recenterOnDistricts,
  loadingProgress,
  refreshSize,
} = useCP1Map(props, primaryDistrict);

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
  padding: 0;
  min-width: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex: 1;
}

.cp-map-card {
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cp-map-card--embedded {
  background: transparent;
  border: 0;
  box-shadow: none;
  padding: 0;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.cp-map {
  width: 100%;
  max-width: 100%;
  height: 100%;
  flex: 1 1 auto;
  min-height: 0;
  border-radius: 14px;
  overflow: hidden;
  margin-top: 0;
}


/* Cluster styling */
:deep(.cp1-cluster) {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(19, 78, 74, 0.35);
  background: rgba(20, 184, 166, 0.16);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(4px);
}

:deep(.cp1-cluster span) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  color: #134e4a;
  font-size: 11px;
  font-weight: 700;
}

:deep(.cp1-cluster--sm) {
  width: 34px !important;
  height: 34px !important;
}

:deep(.cp1-cluster--md) {
  width: 38px !important;
  height: 38px !important;
  background: rgba(13, 148, 136, 0.18);
}

:deep(.cp1-cluster--lg) {
  width: 42px !important;
  height: 42px !important;
  background: rgba(15, 118, 110, 0.22);
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
