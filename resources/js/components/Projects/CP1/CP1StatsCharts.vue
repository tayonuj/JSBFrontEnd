<template>
  <section class="cp-main">
    <section class="jsb-stats-grid jsb-stats-grid--projects" aria-label="Project statistics">
      <article class="jsb-stat-card">
        <span class="jsb-stat-card__icon is-blue">
          <i class="bi bi-people-fill"></i>
        </span>
        <div class="jsb-stat-card__content">
          <strong>{{ currentStats.beneficiaries.toLocaleString() }}</strong>
          <span>Beneficiaries</span>
          <small>{{ currentSubCategory.label }} in {{ currentDistrictLabel }}</small>
        </div>
      </article>

      <article class="jsb-stat-card">
        <span class="jsb-stat-card__icon is-sky">
          <i class="bi bi-geo-alt-fill"></i>
        </span>
        <div class="jsb-stat-card__content">
          <strong>{{ currentStats.supportValue.toLocaleString() }}</strong>
          <span>Total Support Units</span>
          <small>Sum of delivered support</small>
        </div>
      </article>

      <article class="jsb-stat-card">
        <span class="jsb-stat-card__icon is-violet">
          <i class="bi bi-person-hearts"></i>
        </span>
        <div class="jsb-stat-card__content">
          <strong>{{ currentStats.womenLed }}%</strong>
          <span>Women-led Households</span>
          <small>Calculated from Gender data</small>
        </div>
      </article>

      <article class="jsb-stat-card">
        <span class="jsb-stat-card__icon is-teal">
          <i class="bi bi-person-badge-fill"></i>
        </span>
        <div class="jsb-stat-card__content">
          <strong>{{ currentStats.youth }}%</strong>
          <span>Youth Participation</span>
          <small>Beneficiaries aged 18-35</small>
        </div>
      </article>
    </section>

    <section class="jsb-dashboard-grid">
      <article class="jsb-panel jsb-panel--overview">
        <div class="jsb-panel__header">
          <div>
            <h2>Project Overview</h2>
            <p>
              Beneficiary totals and support distribution for
              <strong>{{ currentSubCategory.label.toLowerCase() }}</strong>
              across {{ currentDistrictLabel.toLowerCase() }}.
            </p>
          </div>
        </div>

        <div class="jsb-overview-visuals">
          <div class="jsb-mini-panel">
            <div class="jsb-mini-panel__title">Beneficiaries by District</div>
            <div class="jsb-chart-shell">
              <div ref="barChartDiv" class="cp-chart-container"></div>
            </div>
          </div>

          <div class="jsb-mini-panel">
            <div class="jsb-mini-panel__title">Support Mix</div>
            <div class="jsb-chart-shell">
              <div ref="donutChartDiv" class="cp-chart-container"></div>
            </div>
          </div>
        </div>
      </article>

      <article class="jsb-panel jsb-panel--map">
<!--        <div class="jsb-panel__header">-->
<!--          <div>-->
<!--            <h2>Map View - {{ currentDistrictLabel }}</h2>-->
<!--            <p>-->
<!--              The map highlights beneficiaries and administrative boundaries-->
<!--              related to this project selection.-->
<!--            </p>-->
<!--          </div>-->
<!--        </div>-->

        <CP1Map
          :districts="districts"
          :subCategories="subCategories"
          :selectedDistricts="selectedDistricts"
          :selectedSubCategory="selectedSubCategory"
          :showBeneficiaries="showBeneficiaries"
          :showBoundaries="showBoundaries"
          :statsFor="statsFor"
          :embedded="true"
        />
      </article>
    </section>
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
  selectedDistricts: string[]; // multi-select
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

/* ---------- labels & helpers ---------- */

const currentSubCategory = computed(
    () =>
        props.subCategories.find((c) => c.id === props.selectedSubCategory) ||
        props.subCategories[0]
);

const currentDistrictLabel = computed(() => {
  const ids = props.selectedDistricts || [];
  if (!ids.length) {
    return "All districts";
  }
  if (ids.length === 1) {
    const d = props.districts.find((x) => x.id === ids[0]);
    return d?.name ?? "Selected district";
  }
  return "Multiple districts";
});

const activeDistricts = computed(() => {
  const ids = props.selectedDistricts || [];
  if (!ids.length) return props.districts;
  return props.districts.filter((d) => ids.includes(d.id));
});

const targetDistrictIds = computed(() => {
  const ids = props.selectedDistricts || [];
  return ids.length ? ids : props.districts.map((d) => d.id);
});

/* ---------- chart data for amCharts ---------- */

// bar: one bar per active district for the selected category
const barData = computed(() =>
    activeDistricts.value.map((d) => ({
      district: d.name,
      value: props.statsFor(d.id, props.selectedSubCategory).beneficiaries,
    }))
);

// donut: one slice per category, aggregated over selected district(s)
const donutData = computed(() =>
    props.subCategories.map((c) => {
      const total = targetDistrictIds.value.reduce((sum, dId) => {
        const s = props.statsFor(dId, c.id);
        return sum + (s?.beneficiaries || 0);
      }, 0);
      return {
        category: c.label,
        value: total,
      };
    })
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

  const xRenderer = am5xy.AxisRendererX.new(barRoot, {
    minGridDistance: 15,
  });

  xRenderer.labels.template.setAll({
    fontSize: 10,
    fill: am5.color(0x5f6f8a),
    oversizedBehavior: "truncate",
    maxWidth: 60,
    wrap: true,
    textAlign: "center",
    rotation: -35,
  });

  const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(barRoot, {
        maxDeviation: 0.2,
        categoryField: "district",
        renderer: xRenderer,
      })
  );

  const yRenderer = am5xy.AxisRendererY.new(barRoot, {});
  yRenderer.labels.template.setAll({
    fontSize: 10,
    fill: am5.color(0x5f6f8a),
  });

  const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(barRoot, {
        renderer: yRenderer,
      })
  );

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

/* ---------- donut chart ---------- */

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
    fill: am5.color(0x5f6f8a),
  });

  donutSeries.ticks.template.setAll({
    strokeWidth: 1,
    stroke: am5.color(0x93a4c0),
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
    fill: am5.color(0x5f6f8a),
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

/* ---------- mount + cleanup ---------- */

onMounted(() => {
  initBarChart();
  initDonutChart();
});

onBeforeUnmount(() => {
  barRoot?.dispose();
  donutRoot?.dispose();
});

/* ---------- react to filters ---------- */

watch(barData, () => {
  updateBarChart();
});

watch(donutData, () => {
  updateDonutChart();
});
</script>

<style scoped>
.cp-chart-container {
  width: 100%;
  height: 260px;
}
</style>
