<template>
  <section class="cp-main">
    <div class="container cp-main-inner">
      <div class="cp-main-left">
        <div class="cp-stat-grid">
          <div class="cp-stat-card cp-stat-card-primary">
            <div class="cp-stat-card-header">
              <span class="cp-stat-chip cp-stat-chip-district">
                {{ currentDistrictLabel }}
              </span>
              <span class="cp-stat-chip cp-stat-chip-sub">
                {{ currentSubCategory.label }}
                <template v-if="currentOptionLabel"> · {{ currentOptionLabel }}</template>
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
                Households in
                <strong>{{ currentDistrictLabel.toLowerCase() }}</strong>
                that match
                <strong>{{ currentSubCategory.label.toLowerCase() }}</strong>
                <template v-if="currentOptionLabel">
                  (<strong>{{ currentOptionLabel.toLowerCase() }}</strong>)
                </template>.
              </p>
            </div>
          </div>

          <div class="cp-stat-card">
            <div class="cp-stat-icon cp-stat-icon-money">◎</div>
            <p class="cp-stat-label">Total support units</p>
            <p class="cp-stat-value">
              {{ currentStats.supportValue.toLocaleString() }}
            </p>
            <p class="cp-stat-footnote">
              Sum for {{ currentSubCategory.label.toLowerCase() }}
              <template v-if="currentOptionLabel">
                (<strong>{{ currentOptionLabel.toLowerCase() }}</strong>)
              </template>
              in {{ currentDistrictLabel.toLowerCase() }}.
            </p>
          </div>

          <div class="cp-stat-card">
            <div class="cp-stat-icon cp-stat-icon-women">♀</div>
            <p class="cp-stat-label">Women-led households</p>
            <p class="cp-stat-value">{{ currentStats.womenLed }}%</p>
            <p class="cp-stat-footnote">
              Share of beneficiary households led by women.
            </p>
          </div>

          <div class="cp-stat-card">
            <div class="cp-stat-icon cp-stat-icon-youth">✦</div>
            <p class="cp-stat-label">Youth participation</p>
            <p class="cp-stat-value">{{ currentStats.youth }}%</p>
            <p class="cp-stat-footnote">
              Beneficiaries aged 18–35 years.
            </p>
          </div>
        </div>

        <div class="cp-charts">
          <div class="cp-chart-card">
            <div class="cp-chart-header">
              <h3>Beneficiaries by district</h3>
              <p>
                Households receiving
                <strong>{{ currentSubCategory.label.toLowerCase() }}</strong>
                <template v-if="currentOptionLabel">
                  (<strong>{{ currentOptionLabel.toLowerCase() }}</strong>)
                </template>,
                by district.
              </p>
            </div>
            <div ref="barChartDiv" class="cp-chart-container"></div>
          </div>

          <div class="cp-chart-card">
            <div class="cp-chart-header">
              <h3>Support mix in {{ currentDistrictLabel }}</h3>
              <p>
                Share of beneficiaries by support type across the selected district(s).
              </p>
            </div>
            <div ref="donutChartDiv" class="cp-chart-container"></div>
          </div>
        </div>
      </div>

      <div class="cp-main-right">
        <CP4Map
            :districts="districts"
            :subCategories="subCategories"
            :selectedDistricts="selectedDistricts"
            :selectedSubCategory="selectedSubCategory"
            :selectedSubCategoryOption="selectedSubCategoryOption"
            :showBeneficiaries="showBeneficiaries"
            :showBoundaries="showBoundaries"
            :statsFor="statsFor"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import CP4Map from "./CP4Map.vue";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const props = defineProps<{
  districts: any[];
  subCategories: any[];
  selectedDistricts: string[];
  selectedSubCategory: string;
  selectedSubCategoryOption: string;
  statsFor: (
      districtId: string,
      subCategoryId: string,
      optionId?: string
  ) => {
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

const currentSubCategory = computed(
    () =>
        props.subCategories.find((c) => c.id === props.selectedSubCategory) ||
        props.subCategories[0]
);

const currentOptionLabel = computed(() => {
  const category = currentSubCategory.value;
  const option = (category?.options || []).find(
      (o: any) => o.id === props.selectedSubCategoryOption
  );
  return option?.label || "";
});

const currentDistrictLabel = computed(() => {
  const ids = props.selectedDistricts || [];
  if (!ids.length) return "All districts";
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

const barData = computed(() =>
    activeDistricts.value.map((d) => ({
      district: d.name,
      value: props.statsFor(
          d.id,
          props.selectedSubCategory,
          props.selectedSubCategoryOption || undefined
      ).beneficiaries,
    }))
);

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

  const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(barRoot, {
        renderer: am5xy.AxisRendererY.new(barRoot, {}),
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
  if (!barSeries) return;
  barSeries.data.setAll(barData.value);
};

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

  donutSeries.labels.template.setAll({ fontSize: 10 });
  donutSeries.ticks.template.setAll({ strokeWidth: 1 });
  donutSeries.data.setAll(donutData.value);
};

const updateDonutChart = () => {
  if (!donutSeries) return;
  donutSeries.data.setAll(donutData.value);
};

onMounted(() => {
  initBarChart();
  initDonutChart();
});

onBeforeUnmount(() => {
  barRoot?.dispose();
  donutRoot?.dispose();
});

watch(barData, updateBarChart);
watch(donutData, updateDonutChart);
</script>

<style scoped>
.cp-chart-container {
  width: 100%;
  height: 260px;
}
</style>
