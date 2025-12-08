<template>
  <section class="cp-filters">
    <div class="container">
      <div class="cp-filters-inner">
        <!-- DISTRICTS -->
        <div class="cp-filter-block">
          <div class="cp-filter-header">
            <h2>Explore by district</h2>
            <p class="cp-filter-caption">
              Pick one district to focus the map, stats and charts.
            </p>
          </div>

          <div class="chip-row chip-row-scroll">
            <button
                v-for="d in districts"
                :key="d.id"
                class="chip chip-pill"
                :class="{ active: d.id === selectedDistrict }"
                @click="$emit('update:selectedDistrict', d.id)"
            >
              <span class="chip-dot" :class="{ 'chip-dot-active': d.id === selectedDistrict }"></span>
              <span class="chip-label">{{ d.name }}</span>
              <span
                  v-if="d.id === selectedDistrict"
                  class="chip-tag"
              >
                selected
              </span>
            </button>
          </div>
        </div>

        <!-- SUB-ACTIVITIES -->
        <div class="cp-filter-block">
          <div class="cp-filter-header">
            <h2>Project sub-activities</h2>
            <p class="cp-filter-caption">
              Filter by type of support under this Climate Promise component.
            </p>
          </div>

          <div class="chip-row chip-row-wrap">
            <button
                v-for="c in subCategories"
                :key="c.id"
                class="chip chip-soft chip-pill"
                :class="{ active: c.id === selectedSubCategory }"
                @click="$emit('update:selectedSubCategory', c.id)"
            >
              <span class="chip-label">{{ c.label }}</span>
              <span
                  v-if="c.id === selectedSubCategory"
                  class="chip-check"
              >
                ✓
              </span>
            </button>
          </div>
        </div>

        <!-- MAP LAYERS -->
        <div class="cp-filter-block cp-layer-block">
          <div class="cp-filter-header">
            <h2>Map layers</h2>
            <p class="cp-filter-caption">
              Turn layers on or off to simplify the map view.
            </p>
          </div>

          <div class="layer-toggle-group">
            <label class="toggle-control">
              <input
                  type="checkbox"
                  :checked="showBeneficiaries"
                  @input="$emit('update:showBeneficiaries', ($event.target as HTMLInputElement).checked)"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-text">
                <span class="toggle-title">Beneficiaries</span>
                <span class="toggle-subtitle">Show project locations / points</span>
              </span>
            </label>

            <label class="toggle-control">
              <input
                  type="checkbox"
                  :checked="showBoundaries"
                  @input="$emit('update:showBoundaries', ($event.target as HTMLInputElement).checked)"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-text">
                <span class="toggle-title">Boundaries</span>
                <span class="toggle-subtitle">Show administrative outlines</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  districts: any[];
  subCategories: any[];
  selectedDistrict: string;
  selectedSubCategory: string;
  showBeneficiaries: boolean;
  showBoundaries: boolean;
}>();

defineEmits([
  "update:selectedDistrict",
  "update:selectedSubCategory",
  "update:showBeneficiaries",
  "update:showBoundaries",
]);
</script>
