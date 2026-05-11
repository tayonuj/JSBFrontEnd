<template>
  <section class="cp-main">
    <section class="jsb-stats-grid jsb-stats-grid--projects fp1-stats-row" aria-label="Project statistics">
      <article
        v-for="card in statCards"
        :key="card.label"
        class="jsb-stat-card"
      >
        <span class="jsb-stat-card__icon" :class="card.iconClass">
          <i class="bi" :class="card.icon"></i>
        </span>
        <div class="jsb-stat-card__content">
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
          <small>{{ card.detail }}</small>
        </div>
      </article>
    </section>

    <section class="jsb-dashboard-grid">
      <article class="jsb-panel jsb-panel--overview">
        <div class="jsb-panel__header">
          <div>
            <h2>Project Overview</h2>
<!--            <p>-->
<!--              Beneficiary totals and support distribution for-->
<!--              <strong>{{ currentSubCategory.label.toLowerCase() }}</strong>-->
<!--              across {{ currentDistrictLabel.toLowerCase() }}.-->
<!--            </p>-->
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
            <div class="jsb-mini-panel__title">Distribution of Beneficiaries</div>
            <div class="jsb-chart-shell">
              <div class="donut-chart-wrap">
                <div ref="donutChartDiv" class="cp-chart-container"></div>
                <div class="donut-center-total">
                  <strong>{{ supportMixTotal.toLocaleString() }}</strong>
                  <span>Total</span>
                </div>
              </div>
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

        <FP1Map
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
import FP1Map from "./FP1Map.vue";

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

const districtCount = computed(() => activeDistricts.value.length);

const statCards = computed(() => [
  {
    icon: "bi-people-fill",
    iconClass: "is-green",
    value: props.currentStats.beneficiaries.toLocaleString(),
    label: "Beneficiaries Reached",
    detail: `${currentSubCategory.value.label} support`
  },
  {
    icon: "bi-geo-alt-fill",
    iconClass: "is-teal",
    value: districtCount.value.toLocaleString(),
    label: "Districts Covered",
    detail: "All Project Districts"
  },
  {
    icon: "bi-person-hearts",
    iconClass: "is-violet",
    value: `${props.currentStats.womenLed}%`,
    label: "Women Representation",
    detail: "All Projects"
  },
  {
    icon: "bi-lightning-charge-fill",
    iconClass: "is-teal",
    value: "245 MW",
    label: "Renewable Energy Generated",
    detail: "Total MegaWotts"
  }
]);

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

const supportMixTotal = computed(() =>
    donutData.value.reduce((sum, item) => sum + item.value, 0)
);

/* ---------- amCharts setup ---------- */

const barChartDiv = ref<HTMLDivElement | null>(null);
const donutChartDiv = ref<HTMLDivElement | null>(null);

let barRoot: am5.Root | null = null;
let barSeries: am5xy.ColumnSeries | null = null;

let donutRoot: am5.Root | null = null;
let donutSeries: am5percent.PieSeries | null = null;
let donutLegend: am5.Legend | null = null;

const chartPalette = [0x1f7a3f, 0x2ea44f, 0x23a36a, 0x6d9f12, 0x5f7f1c];
const amChartColors = () => chartPalette.map((color) => am5.color(color));

const hideAmChartLogo = (root: am5.Root | null) => {
  if (!root) return;
  (root as any)._logo?.dispose();
};

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
    fill: am5.color(0x1f7a3f),
    stroke: am5.color(0x1f7a3f),
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
  if (!donutChartDiv.value || donutRoot) return;

  donutRoot = am5.Root.new(donutChartDiv.value);
  donutRoot.setThemes([am5themes_Animated.new(donutRoot)]);
  donutRoot.container.set("layout", donutRoot.verticalLayout);
  hideAmChartLogo(donutRoot);

  const chart = donutRoot.container.children.push(
      am5percent.PieChart.new(donutRoot, {
        innerRadius: am5.percent(62),
        radius: am5.percent(74),
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      })
  );

  chart.get("colors")?.set("colors", amChartColors());

  donutSeries = chart.series.push(
      am5percent.PieSeries.new(donutRoot, {
        name: "Support Mix",
        categoryField: "category",
        valueField: "value",
        tooltip: am5.Tooltip.new(donutRoot, {
          labelText: "{category}: {value} beneficiaries",
        }),
      })
  );

  donutSeries.get("colors")?.set("colors", amChartColors());

  donutSeries.slices.template.setAll({
    stroke: am5.color(0xffffff),
    strokeWidth: 2,
    strokeOpacity: 1,
    fillOpacity: 0.95,
  });

  donutSeries.slices.template.states.create("hover", {
    scale: 1.03,
    fillOpacity: 1,
  });

  donutSeries.labels.template.setAll({
    forceHidden: true,
  });

  donutSeries.ticks.template.setAll({
    forceHidden: true,
  });

  donutLegend = donutRoot.container.children.push(
      am5.Legend.new(donutRoot, {
        x: am5.percent(50),
        centerX: am5.percent(50),
        width: am5.percent(100),
        layout: donutRoot.gridLayout,
      })
  );

  donutLegend.labels.template.setAll({
    fontSize: 9,
    fill: am5.color(0x5f6f8a),
    maxWidth: 105,
    oversizedBehavior: "truncate",
  });

  donutLegend.valueLabels.template.setAll({
    fontSize: 9,
    fill: am5.color(0x17233c),
    oversizedBehavior: "truncate",
  });

  donutLegend.markers.template.setAll({
    width: 9,
    height: 9,
  });

  donutSeries.events.on("datavalidated", () => {
    if (donutSeries && donutLegend) {
      donutLegend.data.setAll(donutSeries.dataItems);
    }
  });

  donutSeries.data.setAll(donutData.value);

  chart.appear(600, 100);
  donutSeries.appear(600);
};

const updateDonutChart = () => {
  if (!donutRoot || !donutSeries) return;
  donutSeries.data.setAll(donutData.value);

  if (donutLegend) {
    donutLegend.data.setAll(donutSeries.dataItems);
  }
};

/* ---------- mount + cleanup ---------- */

onMounted(() => {
  initBarChart();
  initDonutChart();
});

onBeforeUnmount(() => {
  barRoot?.dispose();
  donutRoot?.dispose();

  donutRoot = null;
  donutSeries = null;
  donutLegend = null;
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
.fp1-stats-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.fp1-stats-row :deep(.jsb-stat-card) {
  min-width: 0;
  gap: 12px;
  padding: 14px;
}

.fp1-stats-row :deep(.jsb-stat-card__icon) {
  width: 48px;
  height: 48px;
  font-size: 1.35rem;
}

.fp1-stats-row :deep(.jsb-stat-card__content strong) {
  font-size: 1.5rem;
}

.fp1-stats-row :deep(.jsb-stat-card__content span) {
  font-size: 0.88rem;
}

.fp1-stats-row :deep(.jsb-stat-card__content small) {
  font-size: 0.76rem;
}

.cp-chart-container {
  width: 100%;
  height: 260px;
}

.donut-chart-wrap {
  position: relative;
  width: 100%;
  height: 260px;
}

.donut-chart-wrap .cp-chart-container {
  height: 260px;
}

.donut-center-total {
  position: absolute;
  left: 50%;
  top: 43%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}

.donut-center-total strong {
  max-width: 82px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.35rem;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #17233c;
}

.donut-center-total span {
  margin-top: 0.25rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7b879b;
}

@media (max-width: 1199px) {
  .fp1-stats-row {
    overflow-x: auto;
    grid-template-columns: repeat(5, minmax(180px, 1fr));
    padding-bottom: 4px;
  }
}
</style>
