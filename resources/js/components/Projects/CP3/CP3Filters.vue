<template>
  <section :class="['cp-filters', { 'is-dashboard': dashboardMode }]">
    <div class="container">
      <div class="cp-filters-bar">
        <div class="cp-filter-group">
          <div class="cp-filter-title">
            <span class="cp-filter-icon"><i class="bi bi-geo-alt-fill"></i></span>
            <span class="cp-filter-text">Districts</span>
            <span class="cp-filter-sub">
              <template v-if="!selectedDistricts.length">
                All {{ districts.length }}
              </template>
              <template v-else-if="selectedDistricts.length === 1">
                {{ districts.find((d) => d.id === selectedDistricts[0])?.name }}
              </template>
              <template v-else>
                {{ selectedDistricts.length }} selected
              </template>
            </span>
          </div>

          <div class="chip-row chip-scroll">
            <button
                class="chip chip-pill cp-chip-compact"
                :class="{ active: !selectedDistricts.length }"
                @click="selectAllDistricts"
            >
              All
            </button>

            <button
                v-for="d in districts"
                :key="d.id"
                class="chip chip-pill cp-chip-compact"
                :class="{ active: selectedDistricts.includes(d.id) }"
                @click="toggleDistrict(d.id)"
            >
              {{ d.name }}
            </button>
          </div>
        </div>

        <div class="cp-filter-divider"></div>

        <div class="cp-filter-group">
          <div class="cp-filter-title">
            <span class="cp-filter-icon">🎯</span>
            <span class="cp-filter-text">Project Input</span>
            <span class="cp-filter-sub">{{ selectedFilterSummary }}</span>
          </div>

          <div class="chip-row chip-scroll">
            <button
                class="chip chip-pill cp-chip-compact"
                :class="{ active: !selectedFilters.length }"
                @click="clearFilters"
            >
              All
            </button>

            <button
                v-for="item in energyFilters"
                :key="item.id"
                class="chip chip-pill cp-chip-compact"
                :class="{ active: selectedFilters.includes(item.id) }"
                @click="toggleEnergyFilter(item.id)"
            >
              {{ item.label }}
            </button>

            <button
                v-for="item in genderFilters"
                :key="item.id"
                class="chip chip-pill cp-chip-compact"
                :class="{ active: selectedFilters.includes(item.id) }"
                @click="toggleNormalFilter(item.id)"
            >
              {{ item.label }}
            </button>
          </div>

          <div v-if="isSolarSelected" class="chip-row chip-scroll mt-2">
            <button
                v-for="item in solarBeneficiaryFilters"
                :key="item.id"
                class="chip chip-pill cp-chip-compact"
                :class="{ active: selectedFilters.includes(item.id) }"
                @click="toggleSolarBeneficiaryFilter(item.id)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

<!--        <div class="cp-filter-divider cp-filter-divider&#45;&#45;short"></div>-->

<!--        <div class="cp-filter-group cp-filter-group&#45;&#45;tight">-->
<!--          <div class="cp-filter-title">-->
<!--            <span class="cp-filter-icon">🗺</span>-->
<!--            <span class="cp-filter-text">Layers</span>-->
<!--          </div>-->

<!--          <div class="chip-row">-->
<!--            <button-->
<!--                class="chip chip-pill cp-chip-toggle"-->
<!--                :class="{ active: showBeneficiaries }"-->
<!--                @click="toggleBeneficiaries"-->
<!--            >-->
<!--              <span class="cp-dot cp-dot&#45;&#45;beneficiaries"></span>-->
<!--              Beneficiaries-->
<!--            </button>-->

<!--            <button-->
<!--                class="chip chip-pill cp-chip-toggle"-->
<!--                :class="{ active: showBoundaries }"-->
<!--                @click="toggleBoundaries"-->
<!--            >-->
<!--              <span class="cp-dot cp-dot&#45;&#45;boundaries"></span>-->
<!--              Boundaries-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

type FilterItem = {
  id: string;
  label: string;
};

const ENERGY_FILTER_IDS = ["cookstove", "biogas", "solar"];
const SOLAR_BENEFICIARY_FILTER_IDS = ["school", "hospital", "household"];

const props = withDefaults(
    defineProps<{
      districts?: { id: string; name: string }[];
      selectedDistricts?: string[];
      selectedFilters?: string[];
      showBeneficiaries?: boolean;
      showBoundaries?: boolean;
      dashboardMode?: boolean;
    }>(),
    {
      districts: () => [],
      selectedDistricts: () => [],
      selectedFilters: () => [],
      showBeneficiaries: true,
      showBoundaries: true,
      dashboardMode: false,
    }
);

const emit = defineEmits([
  "update:selectedDistricts",
  "update:selectedFilters",
  "update:showBeneficiaries",
  "update:showBoundaries",
]);

const energyFilters: FilterItem[] = [
  { id: "cookstove", label: "Cookstove" },
  { id: "biogas", label: "Biogas" },
  { id: "solar", label: "Solar" },
];

const genderFilters: FilterItem[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
];

const solarBeneficiaryFilters: FilterItem[] = [
  { id: "school", label: "School" },
  { id: "hospital", label: "Hospital" },
  { id: "household", label: "Household" },
];

const isSolarSelected = computed(() => {
  return props.selectedFilters.includes("solar");
});

const selectedFilterSummary = computed(() => {
  if (!props.selectedFilters.length) return "All";
  return `${props.selectedFilters.length} selected`;
});

const toggleDistrict = (id: string) => {
  const list = props.selectedDistricts || [];

  emit(
      "update:selectedDistricts",
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  );
};

const selectAllDistricts = () => {
  emit("update:selectedDistricts", []);
};

const clearFilters = () => {
  emit("update:selectedFilters", []);
};

const toggleEnergyFilter = (id: string) => {
  const current = props.selectedFilters || [];
  const isAlreadySelected = current.includes(id);

  let next = current.filter((x) => !ENERGY_FILTER_IDS.includes(x));

  if (!isAlreadySelected) {
    next.push(id);
  }

  if (id !== "solar" || isAlreadySelected) {
    next = next.filter((x) => !SOLAR_BENEFICIARY_FILTER_IDS.includes(x));
  }

  emit("update:selectedFilters", next);
};

const toggleNormalFilter = (id: string) => {
  const current = props.selectedFilters || [];

  const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];

  emit("update:selectedFilters", next);
};

const toggleSolarBeneficiaryFilter = (id: string) => {
  if (!isSolarSelected.value) return;

  const current = props.selectedFilters || [];

  const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];

  emit("update:selectedFilters", next);
};

const toggleBeneficiaries = () => {
  emit("update:showBeneficiaries", !props.showBeneficiaries);
};

const toggleBoundaries = () => {
  emit("update:showBoundaries", !props.showBoundaries);
};
</script>

<style scoped>
.cp-filters {
  padding: 0.75rem 0 0.5rem;
}

.cp-filters-bar {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.65rem 0.9rem;
  border-radius: 15px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.97) 0%,
      rgba(245, 248, 252, 0.98) 100%
  );
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.08);
  overflow-x: auto;
}

.cp-filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  white-space: nowrap;
}

.cp-filter-group--tight {
  gap: 0.2rem;
}

.cp-filter-title {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  font-size: 0.86rem;
  color: #52627d;
}

.cp-filter-icon {
  font-size: 0.9rem;
}

.cp-filter-text {
  font-weight: 600;
}

.cp-filter-sub {
  font-size: 0.78rem;
  color: #7b879b;
}

.cp-filter-divider {
  width: 1px;
  height: 2.4rem;
  background: rgba(16, 24, 40, 0.08);
  flex-shrink: 0;
  align-self: center;
}

.cp-filter-divider--short {
  height: 2.1rem;
}

.chip-row {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.chip-scroll {
  overflow-x: auto;
  padding-bottom: 0.1rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.cp-chip-compact {
  font-size: 0.8rem;
  padding-inline: 0.65rem;
  padding-block: 0.2rem;
  min-height: 34px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  border-radius: 999px;
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #55627c;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.cp-chip-toggle {
  font-size: 0.8rem;
  padding-inline: 0.7rem;
  padding-block: 0.18rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-height: 34px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  border-radius: 999px;
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #55627c;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.cp-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: 2px solid currentColor;
}

.cp-dot--beneficiaries {
  color: #0f766e;
}

.cp-dot--boundaries {
  color: #1d4ed8;
}

.chip.active {
  background: linear-gradient(135deg, #2c7ef3 0%, #1958c5 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(37, 100, 214, 0.22);
}

.cp-filters.is-dashboard {
  padding: 0;
}

.cp-filters.is-dashboard .container {
  width: 100%;
  max-width: none;
  padding: 0;
}

.cp-filters.is-dashboard .cp-filters-bar {
  align-items: stretch;
  gap: 14px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
</style>
