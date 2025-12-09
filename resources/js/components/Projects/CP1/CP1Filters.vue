<template>
  <section class="cp-filters">
    <div class="container">
      <div class="cp-filters-bar">
        <!-- DISTRICTS -->
        <div class="cp-filter-group">
          <div class="cp-filter-title">
            <span class="cp-filter-icon">📍</span>
            <span class="cp-filter-text">Districts</span>
            <span class="cp-filter-sub">
              <template v-if="!selectedDistricts.length">
                All {{ districts.length }}
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

        <!-- DIVIDER -->
        <div class="cp-filter-divider"></div>

        <!-- CATEGORIES -->
        <div class="cp-filter-group">
          <div class="cp-filter-title">
            <span class="cp-filter-icon">🎯</span>
            <span class="cp-filter-text">Support</span>
          </div>

          <div class="chip-row chip-scroll">
            <button
                v-for="c in subCategories"
                :key="c.id"
                class="chip chip-pill cp-chip-compact"
                :class="{ active: c.id === selectedSubCategory }"
                @click="selectCategory(c.id)"
            >
              {{ c.label }}
            </button>
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="cp-filter-divider cp-filter-divider--short"></div>

        <!-- TOGGLES -->
        <div class="cp-filter-group cp-filter-group--tight">
          <div class="cp-filter-title">
            <span class="cp-filter-icon">🗺</span>
            <span class="cp-filter-text">Layers</span>
          </div>

          <div class="chip-row">
            <button
                class="chip chip-pill cp-chip-toggle"
                :class="{ active: showBeneficiaries }"
                @click="toggleBeneficiaries"
            >
              <span class="cp-dot cp-dot--beneficiaries"></span>
              Beneficiaries
            </button>

            <button
                class="chip chip-pill cp-chip-toggle"
                :class="{ active: showBoundaries }"
                @click="toggleBoundaries"
            >
              <span class="cp-dot cp-dot--boundaries"></span>
              Boundaries
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  districts: { id: string; name: string }[];
  subCategories: { id: string; label: string; column: string }[];
  selectedDistricts: string[];
  selectedSubCategory: string;
  showBeneficiaries: boolean;
  showBoundaries: boolean;
}>();

const emit = defineEmits([
  "update:selectedDistricts",
  "update:selectedSubCategory",
  "update:showBeneficiaries",
  "update:showBoundaries",
]);

/* -------- District multi-select -------- */
const toggleDistrict = (id: string) => {
  const list = props.selectedDistricts || [];
  emit(
      "update:selectedDistricts",
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  );
};

const selectAllDistricts = () => emit("update:selectedDistricts", []);

/* -------- Category single-select -------- */
const selectCategory = (id: string) =>
    emit("update:selectedSubCategory", id);

/* -------- Toggles -------- */
const toggleBeneficiaries = () =>
    emit("update:showBeneficiaries", !props.showBeneficiaries);

const toggleBoundaries = () =>
    emit("update:showBoundaries", !props.showBoundaries);
</script>

<style scoped>
.cp-filters {
  padding: 0.75rem 0 0.5rem;
}

/* Main horizontal bar */
.cp-filters-bar {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.65rem 0.9rem;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.07);
  overflow-x: auto;
}

/* Each logical group (districts / categories / layers) */
.cp-filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  white-space: nowrap;
}

.cp-filter-group--tight {
  gap: 0.2rem;
}

/* Group header */
.cp-filter-title {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  font-size: 0.86rem;
  color: #0f172a;
}

.cp-filter-icon {
  font-size: 0.9rem;
}

.cp-filter-text {
  font-weight: 600;
}

.cp-filter-sub {
  font-size: 0.78rem;
  color: #64748b;
}

/* Divider between groups */
.cp-filter-divider {
  width: 1px;
  height: 2.4rem;
  background: rgba(148, 163, 184, 0.4);
  flex-shrink: 0;
  align-self: center;
}

.cp-filter-divider--short {
  height: 2.1rem;
}

/* Chips row */
.chip-row {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.chip-scroll {
  overflow-x: auto;
  padding-bottom: 0.1rem;
}

/* Compact chips for filter bar */
.cp-chip-compact {
  font-size: 0.8rem;
  padding-inline: 0.65rem;
  padding-block: 0.2rem;
}

/* Toggle chips */
.cp-chip-toggle {
  font-size: 0.8rem;
  padding-inline: 0.7rem;
  padding-block: 0.18rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* Small colored dots for layers */
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

/* Active chip styling (uses your existing .chip base) */
.chip.active {
  background: #0f766e;
  color: #ffffff;
}
</style>
