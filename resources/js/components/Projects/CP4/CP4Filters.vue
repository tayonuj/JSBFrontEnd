<template>
  <section class="cp-filters">
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
                {{ districts.find((district) => district.id === selectedDistricts[0])?.name }}
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
              v-for="district in districts"
              :key="district.id"
              class="chip chip-pill cp-chip-compact"
              :class="{ active: selectedDistricts.includes(district.id) }"
              @click="toggleDistrict(district.id)"
            >
              {{ district.name }}
            </button>
          </div>
        </div>

        <div class="cp-filter-divider"></div>

        <div class="cp-filter-group">
          <div class="cp-filter-title">
            <span class="cp-filter-icon">🎯</span>
            <span class="cp-filter-text">Project Input</span>
          </div>

          <div class="chip-row chip-scroll">
            <button
              class="chip chip-pill cp-chip-compact"
              :class="{ active: selectedProjectInput === 'all' }"
              @click="emit('update:selectedProjectInput', 'all')"
            >
              All
            </button>

            <button
              v-for="option in projectInputOptions"
              :key="option.id"
              class="chip chip-pill cp-chip-compact"
              :class="{ active: option.id === selectedProjectInput }"
              @click="emit('update:selectedProjectInput', option.id)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="cp-filter-divider"></div>

        <div class="cp-filter-group">
          <div class="cp-filter-title">
            <span class="cp-filter-icon">👥</span>
            <span class="cp-filter-text">Gender</span>
          </div>

          <div class="chip-row chip-scroll">
            <button
              v-for="option in genderOptions"
              :key="option.id"
              class="chip chip-pill cp-chip-compact"
              :class="{ active: option.id === selectedGender }"
              @click="emit('update:selectedGender', option.id)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div v-if="showSystemHpFilter" class="cp-filter-divider"></div>

        <div v-if="showSystemHpFilter" class="cp-filter-group">
          <div class="cp-filter-title">
            <span class="cp-filter-icon">☀️</span>
            <span class="cp-filter-text">System (HP)</span>
          </div>

          <div class="chip-row chip-scroll">
            <button
              v-for="option in systemHpOptions"
              :key="option.id"
              class="chip chip-pill cp-chip-compact"
              :class="{ active: option.id === selectedSystemHp }"
              @click="emit('update:selectedSystemHp', option.id)"
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
              @click="emit('update:showBeneficiaries', !showBeneficiaries)"
            >
              <span class="cp-dot cp-dot--beneficiaries"></span>
              Beneficiaries
            </button>

            <button
              class="chip chip-pill cp-chip-toggle"
              :class="{ active: showBoundaries }"
              @click="emit('update:showBoundaries', !showBoundaries)"
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
type Option = {
  id: string;
  label: string;
};

const props = defineProps<{
  districts: { id: string; name: string }[];
  projectInputOptions: Option[];
  genderOptions: Option[];
  systemHpOptions: Option[];
  selectedDistricts: string[];
  selectedProjectInput: string;
  selectedGender: string;
  selectedSystemHp: string;
  showSystemHpFilter: boolean;
  showBeneficiaries: boolean;
  showBoundaries: boolean;
  dashboardMode?: boolean;
}>();

const emit = defineEmits([
  "update:selectedDistricts",
  "update:selectedProjectInput",
  "update:selectedGender",
  "update:selectedSystemHp",
  "update:showBeneficiaries",
  "update:showBoundaries",
]);

const toggleDistrict = (id: string) => {
  const list = props.selectedDistricts || [];
  emit(
    "update:selectedDistricts",
    list.includes(id) ? list.filter((value) => value !== id) : [...list, id]
  );
};

const selectAllDistricts = () => emit("update:selectedDistricts", []);
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
  color: #16a34a;
}

.cp-dot--boundaries {
  color: #4b5563;
}

.chip.active {
  background: linear-gradient(135deg, #2c7ef3 0%, #1958c5 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(37, 100, 214, 0.22);
}
</style>
