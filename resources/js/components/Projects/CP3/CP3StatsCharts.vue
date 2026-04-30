<template>
  <section class="cp-main">
    <section
        class="jsb-stats-grid jsb-stats-grid--projects"
        aria-label="Project statistics"
    >
      <article class="jsb-stat-card">
        <span class="jsb-stat-card__icon is-blue">
          <i class="bi bi-people-fill"></i>
        </span>

        <div class="jsb-stat-card__content">
          <strong>{{ safeCurrentStats.beneficiaries.toLocaleString() }}</strong>
          <span>Beneficiaries</span>
          <small>{{ selectedFilterLabel }}</small>
        </div>
      </article>

      <article class="jsb-stat-card">
        <span class="jsb-stat-card__icon is-sky">
          <i class="bi bi-geo-alt-fill"></i>
        </span>

        <div class="jsb-stat-card__content">
          <strong>{{ safeCurrentStats.supportValue.toLocaleString() }}</strong>
          <span>Total Support Units</span>
          <small>{{ currentDistrictLabel }}</small>
        </div>
      </article>

      <article class="jsb-stat-card">
        <span class="jsb-stat-card__icon is-violet">
          <i class="bi bi-person-hearts"></i>
        </span>

        <div class="jsb-stat-card__content">
          <strong>{{ safeCurrentStats.womenLed }}%</strong>
          <span>Women-led Households</span>
          <small>Share of beneficiary households</small>
        </div>
      </article>

      <article class="jsb-stat-card">
        <span class="jsb-stat-card__icon is-teal">
          <i class="bi bi-person-badge-fill"></i>
        </span>

        <div class="jsb-stat-card__content">
          <strong>{{ safeCurrentStats.youth }}%</strong>
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
              Household support metrics for
              <strong>{{ selectedFilterLabel.toLowerCase() }}</strong>
              across {{ currentDistrictLabel.toLowerCase() }}.
            </p>
          </div>
        </div>

        <div class="jsb-overview-visuals">
          <div class="jsb-mini-panel">
            <div class="jsb-mini-panel__title">Beneficiaries by DSD</div>

            <div class="jsb-chart-shell">
              <div ref="barChartDiv" class="cp-chart-container"></div>
            </div>
          </div>

          <div class="jsb-mini-panel">
            <div class="jsb-mini-panel__title">Support Mix</div>

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
        <CP3Map
            :districts="safeDistricts"
            :selectedDistricts="safeSelectedDistricts"
            :selectedFilters="safeSelectedFilters"
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import CP3Map from "./CP3Map.vue";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

type SupportMix = {
  cookstove: number;
  biogas: number;
  solar: number;
};

type Stat = {
  beneficiaries: number;
  supportValue: number;
  womenLed: number;
  youth: number;
  supportMix: SupportMix;
};

type DsdChartItem = {
  dsd: string;
  value: number;
};

const props = defineProps<{
  districts?: any[];
  selectedDistricts?: string[];
  selectedFilters?: string[];
  dsdChartData?: DsdChartItem[];
  statsFor?: (districtId: string) => Stat;
  currentStats?: Stat;
  showBeneficiaries?: boolean;
  showBoundaries?: boolean;
}>();

const defaultStat = (): Stat => ({
  beneficiaries: 0,
  supportValue: 0,
  womenLed: 0,
  youth: 0,
  supportMix: {
    cookstove: 0,
    biogas: 0,
    solar: 0,
  },
});

const safeDistricts = computed(() => props.districts || []);
const safeSelectedDistricts = computed(() => props.selectedDistricts || []);
const safeSelectedFilters = computed(() => props.selectedFilters || []);
const safeDsdChartData = computed(() => props.dsdChartData || []);
const safeCurrentStats = computed(() => props.currentStats || defaultStat());

const showBeneficiaries = computed(() => props.showBeneficiaries ?? true);
const showBoundaries = computed(() => props.showBoundaries ?? true);

const statsFor = (districtId: string): Stat => {
  if (props.statsFor) {
    return props.statsFor(districtId);
  }

  return defaultStat();
};

const filterLabels: Record<string, string> = {
  cookstove: "Cookstove",
  biogas: "Biogas",
  solar: "Solar",
  male: "Male",
  female: "Female",
  school: "School",
  hospital: "Hospital",
  household: "Household",
};

const selectedFilterLabel = computed(() => {
  const filters = safeSelectedFilters.value;

  if (!filters.length) return "All beneficiaries";

  return filters.map((filter) => filterLabels[filter] || filter).join(" · ");
});

const currentDistrictLabel = computed(() => {
  const ids = safeSelectedDistricts.value;

  if (!ids.length) return "All districts";

  if (ids.length === 1) {
    const district = safeDistricts.value.find((item) => item.id === ids[0]);
    return district?.name ?? "Selected district";
  }

  return "Multiple districts";
});

const barData = computed(() =>
    safeDsdChartData.value.map((item) => ({
      dsd: item.dsd,
      value: item.value,
    }))
);

const donutData = computed(() => [
  {
    category: "Cookstove",
    value: safeCurrentStats.value.supportMix?.cookstove || 0,
  },
  {
    category: "Biogas",
    value: safeCurrentStats.value.supportMix?.biogas || 0,
  },
  {
    category: "Solar",
    value: safeCurrentStats.value.supportMix?.solar || 0,
  },
]);

const supportMixTotal = computed(() =>
    donutData.value.reduce((sum, item) => sum + item.value, 0)
);

const chartPalette = [0x2f77e2, 0x35c78a, 0xffb547];

const amChartColors = () => chartPalette.map((color) => am5.color(color));

const hideAmChartLogo = (root: am5.Root | null) => {
  if (!root) return;
  (root as any)._logo?.dispose();
};

const barChartDiv = ref<HTMLDivElement | null>(null);
const donutChartDiv = ref<HTMLDivElement | null>(null);

let barRoot: am5.Root | null = null;
let barXAxis: any = null;
let barSeries: am5xy.ColumnSeries | null = null;

let donutRoot: am5.Root | null = null;
let donutSeries: am5percent.PieSeries | null = null;
let donutLegend: am5.Legend | null = null;

const initBarChart = () => {
  if (!barChartDiv.value || barRoot) return;

  barRoot = am5.Root.new(barChartDiv.value);
  barRoot.setThemes([am5themes_Animated.new(barRoot)]);
  hideAmChartLogo(barRoot);

  const chart = barRoot.container.children.push(
      am5xy.XYChart.new(barRoot, {
        layout: barRoot.verticalLayout,
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 18,
        paddingLeft: 0,
      })
  );

  chart.get("colors")?.set("colors", amChartColors());

  const xRenderer = am5xy.AxisRendererX.new(barRoot, {
    minGridDistance: 15,
  });

  xRenderer.grid.template.setAll({
    visible: false,
  });

  xRenderer.labels.template.setAll({
    fontSize: 9,
    fill: am5.color(0x5f6f8a),
    oversizedBehavior: "truncate",
    maxWidth: 72,
    textAlign: "center",
    rotation: -35,
    centerY: am5.percent(50),
    centerX: am5.percent(100),
    paddingTop: 4,
  });

  barXAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(barRoot, {
        categoryField: "dsd",
        renderer: xRenderer,
      })
  );

  const yRenderer = am5xy.AxisRendererY.new(barRoot, {});

  yRenderer.labels.template.setAll({
    fontSize: 10,
    fill: am5.color(0x5f6f8a),
  });

  yRenderer.grid.template.setAll({
    strokeOpacity: 0.08,
  });

  const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(barRoot, {
        min: 0,
        renderer: yRenderer,
      })
  );

  barSeries = chart.series.push(
      am5xy.ColumnSeries.new(barRoot, {
        name: "Beneficiaries",
        xAxis: barXAxis,
        yAxis,
        valueYField: "value",
        categoryXField: "dsd",
      })
  );

  barSeries.columns.template.setAll({
    cornerRadiusTL: 8,
    cornerRadiusTR: 8,
    fillOpacity: 0.9,
    strokeOpacity: 0,
    tooltipText: "{categoryX}: {valueY} beneficiaries",
  });

  barXAxis.data.setAll(barData.value);
  barSeries.data.setAll(barData.value);

  chart.appear(600, 100);
  barSeries.appear(600);
};

const updateBarChart = () => {
  if (!barXAxis || !barSeries) return;

  barXAxis.data.setAll(barData.value);
  barSeries.data.setAll(barData.value);
};

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
  if (!donutSeries) return;

  donutSeries.data.setAll(donutData.value);

  if (donutLegend) {
    donutLegend.data.setAll(donutSeries.dataItems);
  }
};

onMounted(() => {
  initBarChart();
  initDonutChart();
});

onBeforeUnmount(() => {
  barRoot?.dispose();
  donutRoot?.dispose();

  barRoot = null;
  barXAxis = null;
  barSeries = null;

  donutRoot = null;
  donutSeries = null;
  donutLegend = null;
});

watch(barData, updateBarChart);
watch(donutData, updateDonutChart);
</script>

<style scoped>
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
  margin-top: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #6b7a90;
}
</style>
