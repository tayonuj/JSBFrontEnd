<template>
  <section class="cp-main">
    <div class="container cp-main-inner">
      <!-- LEFT: STATS & CHARTS -->
      <div class="cp-main-left">
        <!-- STAT CARDS -->
        <div class="cp-stat-grid">
          <!-- PRIMARY CARD -->
          <div class="cp-stat-card cp-stat-card-primary">
            <div class="cp-stat-card-header">
      <span class="cp-stat-chip cp-stat-chip-district">
        {{ currentDistrict.name }}
      </span>
              <span class="cp-stat-chip cp-stat-chip-sub">
        {{ currentSubCategory.label }}
      </span>
            </div>

            <div class="cp-stat-main">
              <div>
                <p class="cp-stat-label">Beneficiaries</p>
                <p class="cp-stat-value-large">
                  {{ currentStats.beneficiaries.toLocaleString() }}
                </p>
              </div>
              <p class="cp-stat-footnote">
                Total beneficiaries for the selected sub-activity in this district.
              </p>
            </div>
          </div>

          <!-- SUPPORT VALUE -->
          <div class="cp-stat-card">
            <div class="cp-stat-icon cp-stat-icon-money">₨</div>
            <p class="cp-stat-label">Support value</p>
            <p class="cp-stat-value">
              LKR {{ (currentStats.supportValue / 1_000_000).toFixed(1) }}M
            </p>
            <p class="cp-stat-footnote">Grants, inputs and services.</p>
          </div>

          <!-- WOMEN-LED -->
          <div class="cp-stat-card">
            <div class="cp-stat-icon cp-stat-icon-women">♀</div>
            <p class="cp-stat-label">Women-led households</p>
            <p class="cp-stat-value">
              {{ currentStats.womenLed }}%
            </p>
            <p class="cp-stat-footnote">
              Share of beneficiary households led by women.
            </p>
          </div>

          <!-- YOUTH -->
          <div class="cp-stat-card">
            <div class="cp-stat-icon cp-stat-icon-youth">✦</div>
            <p class="cp-stat-label">Youth participation</p>
            <p class="cp-stat-value">
              {{ currentStats.youth }}%
            </p>
            <p class="cp-stat-footnote">
              Beneficiaries aged 18–35 years.
            </p>
          </div>
        </div>



        <!-- amCharts -->
        <div class="cp-charts">
          <!-- BAR: Beneficiaries by district -->
          <div class="cp-chart-card">
            <div class="cp-chart-header">
              <h3>Beneficiaries by district</h3>
              <p>For the selected sub-activity: {{ currentSubCategory.label }}</p>
            </div>
            <div ref="barChartDiv" class="cp-chart-container"></div>
          </div>

          <!-- DONUT: Activity mix in district -->
          <div class="cp-chart-card">
            <div class="cp-chart-header">
              <h3>Activity mix in {{ currentDistrict.name }}</h3>
              <p>Share of beneficiaries by sub-activity.</p>
            </div>
            <div ref="donutChartDiv" class="cp-chart-container"></div>
          </div>
        </div>
      </div>

      <!-- RIGHT: MAP -->
      <div class="cp-main-right">
        <CP1Map
            :districts="districts"
            :selectedDistrict="selectedDistrict"
            :selectedSubCategory="selectedSubCategory"
            :statsFor="statsFor"
            :showBeneficiaries="showBeneficiaries"
            :showBoundaries="showBoundaries"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import CP1Map from "./CP1Map.vue";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const props = defineProps<{
  districts: any[];
  subCategories: any[];
  selectedDistrict: string;
  selectedSubCategory: string;
  statsFor: (districtId: string, subCategoryId: string) => {
    beneficiaries: number;
    supportValue: number;
    womenLed: number;
    youth: number;
  };
  currentStats: {
    beneficiaries: number;
    supportValue: number;
    womenLed: number;
    youth: number;
  };
  showBeneficiaries: boolean;
  showBoundaries: boolean;
}>();

/* ---------- basic computed helpers ---------- */

const currentDistrict = computed(
    () => props.districts.find(d => d.id === props.selectedDistrict) || props.districts[0]
);

const currentSubCategory = computed(
    () => props.subCategories.find(c => c.id === props.selectedSubCategory) || props.subCategories[0]
);

/* ---------- chart data for amCharts ---------- */

// bar: one bar per district
const barData = computed(() =>
    props.districts.map(d => ({
      district: d.name,
      value: props.statsFor(d.id, props.selectedSubCategory).beneficiaries,
    }))
);

// donut: one slice per sub-activity in selected district
const donutData = computed(() =>
    props.subCategories.map(c => ({
      category: c.label,
      value: props.statsFor(props.selectedDistrict, c.id).beneficiaries,
    }))
);

/* ---------- amCharts setup ---------- */

const barChartDiv = ref<HTMLDivElement | null>(null);
const donutChartDiv = ref<HTMLDivElement | null>(null);

let barRoot: am5.Root | null = null;
let barSeries: am5xy.ColumnSeries | null = null;

let donutRoot: am5.Root | null = null;
let donutSeries: am5percent.PieSeries | null = null;

const initBarChart = () => {
  if (!barChartDiv.value) return;

  barRoot = am5.Root.new(barChartDiv.value);
  barRoot.setThemes([am5themes_Animated.new(barRoot)]);

  const chart = barRoot.container.children.push(
      am5xy.XYChart.new(barRoot, {
        layout: barRoot.verticalLayout,
        paddingTop: 0,
        paddingBottom: 0,
      })
  );

  /* ---- X AXIS (DISTRICT NAMES) ---- */
  const xRenderer = am5xy.AxisRendererX.new(barRoot, {
    minGridDistance: 15,
  });

  /* Smaller font + wrap or rotate text */
  xRenderer.labels.template.setAll({
    fontSize: 10,
    oversizedBehavior: "truncate",   // or: "wrap", "fit", "none"
    maxWidth: 60,
    wrap: true,
    textAlign: "center",
    rotation: -35,                   // rotate to avoid overlaps
  });

  const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(barRoot, {
        maxDeviation: 0.2,
        categoryField: "district",
        renderer: xRenderer,
      })
  );

  /* ---- Y AXIS ---- */
  const yRenderer = am5xy.AxisRendererY.new(barRoot, {});
  yRenderer.labels.template.setAll({
    fontSize: 10,
  });

  const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(barRoot, {
        renderer: yRenderer,
      })
  );

  /* ---- SERIES ---- */
  barSeries = chart.series.push(
      am5xy.ColumnSeries.new(barRoot, {
        name: "Beneficiaries",
        xAxis,
        yAxis,
        valueYField: "value",
        categoryXField: "district",
      })
  );

  barSeries.columns.template.setAll({
    cornerRadiusTL: 4,
    cornerRadiusTR: 4,
    fillOpacity: 0.85,
    strokeOpacity: 0,
    tooltipText: "{categoryX}: {valueY} beneficiaries",
  });

  xAxis.data.setAll(barData.value);
  barSeries.data.setAll(barData.value);
};


const updateBarChart = () => {
  if (!barRoot || !barSeries) return;
  barSeries.data.setAll(barData.value);
};

/* donut chart */

const initDonutChart = () => {
  if (!donutChartDiv.value) return;

  donutRoot = am5.Root.new(donutChartDiv.value);
  donutRoot.setThemes([am5themes_Animated.new(donutRoot)]);

  const chart = donutRoot.container.children.push(
      am5percent.PieChart.new(donutRoot, {
        innerRadius: am5.percent(55),
      })
  );

  donutSeries = chart.series.push(
      am5percent.PieSeries.new(donutRoot, {
        name: "Activities",
        categoryField: "category",
        valueField: "value",
        tooltip: am5.Tooltip.new(donutRoot, {
          labelText: "{category}: {value} beneficiaries",
        }),
      })
  );

  donutSeries.labels.template.setAll({
    fontSize: 10,
  });

  donutSeries.ticks.template.setAll({
    strokeWidth: 1,
  });

  const legend = donutRoot.container.children.push(
      am5.Legend.new(donutRoot, {
        x: am5.percent(50),
        centerX: am5.percent(50),
        y: am5.percent(95),
        centerY: am5.percent(95),
        layout: donutRoot.horizontalLayout,
      })
  );

  legend.labels.template.setAll({
    fontSize: 10,
    maxWidth: 80,
    oversizedBehavior: "wrap",
  });
  legend.markers.template.setAll({
    width: 10,
    height: 10,
  });


  donutSeries.data.setAll(donutData.value);
};

const updateDonutChart = () => {
  if (!donutRoot || !donutSeries) return;
  donutSeries.data.setAll(donutData.value);
};

/* mount + cleanup */

onMounted(() => {
  initBarChart();
  initDonutChart();
});

onBeforeUnmount(() => {
  barRoot?.dispose();
  donutRoot?.dispose();
});

/* react to filters */

watch(barData, () => {
  updateBarChart();
});

watch(donutData, () => {
  updateDonutChart();
});
</script>

<style scoped>
/* just ensure the chart containers have a fixed height */
.cp-chart-container {
  width: 100%;
  height: 260px;
}
</style>
