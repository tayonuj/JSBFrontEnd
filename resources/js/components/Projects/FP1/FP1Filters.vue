<template>
  <section class="cp-filters" :class="{ 'is-dashboard': dashboardMode }">
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
              <template v-else>
                {{ selectedDistricts.length }} selected
              </template>
            </span>
          </div>

          <div class="chip-row chip-scroll">
            <button
              type="button"
              class="chip chip-pill cp-chip-compact"
              :class="{ active: !selectedDistricts.length }"
              @click="selectAllDistricts"
            >
              All
            </button>

            <button
              v-for="d in districts"
              :key="d.id"
              type="button"
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
            <span class="cp-filter-text">Project Benefits</span>
          </div>

          <div class="chip-row chip-scroll">
            <button
              v-for="c in subCategories"
              :key="c.id"
              type="button"
              class="chip chip-pill cp-chip-compact"
              :class="{ active: c.id === selectedSubCategory }"
              @click="selectCategory(c.id)"
            >
              {{ c.label }}
            </button>
          </div>
        </div>

<!--        <div class="cp-filter-divider cp-filter-divider&#45;&#45;short"></div>-->

<!--        <div class="cp-filter-group cp-filter-group&#45;&#45;tight">-->
<!--          <div class="cp-filter-title">-->
<!--            <span class="cp-filter-icon"><i class="bi bi-layers-fill"></i></span>-->
<!--            <span class="cp-filter-text">Layers</span>-->
<!--          </div>-->

<!--          <div class="chip-row">-->
<!--            <button-->
<!--              type="button"-->
<!--              class="chip chip-pill cp-chip-toggle"-->
<!--              :class="{ active: showBeneficiaries }"-->
<!--              @click="toggleBeneficiaries"-->
<!--            >-->
<!--              <span class="cp-dot cp-dot&#45;&#45;beneficiaries"></span>-->
<!--              Beneficiaries-->
<!--            </button>-->

<!--            <button-->
<!--              type="button"-->
<!--              class="chip chip-pill cp-chip-toggle"-->
<!--              :class="{ active: showBoundaries }"-->
<!--              @click="toggleBoundaries"-->
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
const props = withDefaults(defineProps<{
  districts: { id: string; name: string }[];
  subCategories: { id: string; label: string; column: string }[];
  selectedDistricts: string[];
  selectedSubCategory: string;
  showBeneficiaries: boolean;
  showBoundaries: boolean;
  dashboardMode?: boolean;
}>(), {
  dashboardMode: false
});

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

.cp-filters-bar {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.65rem 0.9rem;
  border-radius: 15px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(245, 248, 252, 0.98) 100%);
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
  line-height: 1;
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
  color: #3f6b2a;
}

.chip.active {
  background: linear-gradient(135deg, #2ea44f 0%, #1f7a3f 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(31, 122, 63, 0.22);
}

.is-dashboard {
  padding: 0;
}

.is-dashboard .container {
  width: 100%;
  max-width: none;
  padding: 0;
}

.is-dashboard .cp-filters-bar {
  align-items: stretch;
  gap: 14px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.is-dashboard .cp-filter-group {
  min-width: 0;
  gap: 8px;
}

.is-dashboard .cp-filter-title {
  gap: 8px;
  font-size: 0.85rem;
  color: #52627d;
}

.is-dashboard .cp-filter-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #edf8ef;
  color: #1f7a3f;
  font-size: 0.72rem;
}

.is-dashboard .cp-filter-text {
  color: #17233c;
  font-weight: 700;
}

.is-dashboard .cp-filter-sub {
  color: #7b879b;
}

.is-dashboard .cp-filter-divider {
  align-self: stretch;
  height: auto;
  background: rgba(16, 24, 40, 0.08);
}

.is-dashboard .chip-row {
  flex-wrap: wrap;
  gap: 8px;
}

.is-dashboard .chip-scroll {
  overflow: visible;
  padding-bottom: 0;
}

.is-dashboard .cp-chip-compact,
.is-dashboard .cp-chip-toggle {
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  border-radius: 999px;
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #55627c;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.is-dashboard .cp-chip-compact:hover,
.is-dashboard .cp-chip-toggle:hover {
  border-color: rgba(31, 122, 63, 0.22);
  color: #1f7a3f;
}

.is-dashboard .chip.active {
  border-color: transparent;
  background: linear-gradient(135deg, #2ea44f 0%, #1f7a3f 100%);
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(31, 122, 63, 0.22);
}

.is-dashboard .cp-dot--beneficiaries {
  color: #16a34a;
}

.is-dashboard .cp-dot--boundaries {
  color: #4b5563;
}
</style>
