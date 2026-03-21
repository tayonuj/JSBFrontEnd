<template>
  <section class="cp-filters">
    <div class="container">
      <div class="cp-filters-bar">
        <div class="cp-filter-group">
          <div class="cp-filter-title">
            <span class="cp-filter-icon">📍</span>
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

          <div v-if="currentSubCategory?.options?.length" class="chip-row chip-scroll mt-2">
            <button
                class="chip chip-pill cp-chip-compact"
                :class="{ active: !selectedSubCategoryOption }"
                @click="selectAllOptions"
            >
              All
            </button>

            <button
                v-for="option in currentSubCategory.options"
                :key="option.id"
                class="chip chip-pill cp-chip-compact"
                :class="{ active: option.id === selectedSubCategoryOption }"
                @click="selectOption(option.id)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="cp-filter-divider cp-filter-divider--short"></div>

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
import { computed } from "vue";

type SubCategoryOption = {
  id: string;
  label: string;
  values: string[];
};

type SubCategory = {
  id: string;
  label: string;
  column: string;
  options: SubCategoryOption[];
};

const props = defineProps<{
  districts: { id: string; name: string }[];
  subCategories: SubCategory[];
  selectedDistricts: string[];
  selectedSubCategory: string;
  selectedSubCategoryOption: string;
  showBeneficiaries: boolean;
  showBoundaries: boolean;
}>();

const emit = defineEmits([
  "update:selectedDistricts",
  "update:selectedSubCategory",
  "update:selectedSubCategoryOption",
  "update:showBeneficiaries",
  "update:showBoundaries",
]);

const currentSubCategory = computed(() => {
  return props.subCategories.find((c) => c.id === props.selectedSubCategory);
});

const toggleDistrict = (id: string) => {
  const list = props.selectedDistricts || [];
  emit(
      "update:selectedDistricts",
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  );
};

const selectAllDistricts = () => emit("update:selectedDistricts", []);

const selectCategory = (id: string) => {
  emit("update:selectedSubCategory", id);
  emit("update:selectedSubCategoryOption", "");
};

const selectOption = (id: string) => emit("update:selectedSubCategoryOption", id);

const selectAllOptions = () => emit("update:selectedSubCategoryOption", "");

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
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.07);
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
}
.cp-chip-toggle {
  font-size: 0.8rem;
  padding-inline: 0.7rem;
  padding-block: 0.18rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
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
  background: #0f766e;
  color: #ffffff;
}
</style>
