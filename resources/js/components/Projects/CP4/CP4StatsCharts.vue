<template>
  <section class="cp-main">
      <section class="jsb-stats-grid" aria-label="Key statistics">
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
<!--              <p>-->
<!--                Vulnerability and livelihood support metrics for-->
<!--                <strong>{{ overviewLabel }}</strong>-->
<!--                across {{ currentDistrictLabel.toLowerCase() }}.-->
<!--              </p>-->
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
              <div class="jsb-mini-panel__title">Distribution of Beneficieries</div>
              <div class="jsb-chart-shell">
                <div class="donut-chart-wrap">
                  <div ref="donutChartDiv" class="cp-chart-container"></div>
                  <div class="donut-center-total">
                    <strong>{{ supportMixTotal.toLocaleString() }}</strong>
                    <span>Total</span>
                  </div>
                </div>
                <div v-if="donutLegendItems.length" class="jsb-donut-legend" aria-label="Support mix legend">
                  <div
                    v-for="item in donutLegendItems"
                    :key="item.category"
                    class="jsb-donut-legend__item"
                  >
                    <span class="jsb-donut-legend__label">
                      <span
                        class="jsb-donut-legend__swatch"
                        :style="{ backgroundColor: item.color }"
                        aria-hidden="true"
                      ></span>
                      <span class="jsb-donut-legend__text" :title="item.category">{{ item.category }}</span>
                    </span>
                    <span class="jsb-donut-legend__value">{{ item.percentage }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </article>

        <article class="jsb-panel jsb-panel--map">
<!--          <div class="jsb-panel__header">-->
<!--            <div>-->
<!--              <h2>Map View - {{ currentDistrictLabel }}</h2>-->
<!--              <p>-->
<!--                The map highlights beneficiaries and administrative boundaries-->
<!--                related to this project selection.-->
<!--              </p>-->
<!--            </div>-->
<!--          </div>-->

          <CP4Map
            :districts="districts"
            :projectInputOptions="projectInputOptions"
            :selectedDistricts="selectedDistricts"
            :selectedProjectInput="selectedProjectInput"
            :selectedGender="selectedGender"
            :selectedSystemHp="selectedSystemHp"
            :statsFor="statsFor"
            :showBeneficiaries="showBeneficiaries"
            :showBoundaries="showBoundaries"
            :embedded="true"
          />
        </article>
      </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import CP4Map from "./CP4Map.vue";
import {
  CP4_SUPPORT_MIX_PALETTE,
  getCP4SupportMixColorMap,
} from "./cp4SupportMixColors";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const props = defineProps<{
  districts: any[];
  projectInputOptions: { id: string; label: string }[];
  selectedDistricts: string[];
  selectedProjectInput: string;
  selectedGender: string;
  selectedSystemHp: string;
  showSystemHpFilter: boolean;
  statsFor: (
      districtId: string,
      projectInputId?: string,
      genderId?: string,
      systemHpId?: string
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

const selectedProjectInputLabel = computed(() => {
  if (props.selectedProjectInput === "all") return "All project inputs";
  return (
    props.projectInputOptions.find((option) => option.id === props.selectedProjectInput)?.label ||
    "Selected project input"
  );
});

const selectedGenderLabel = computed(() => {
  if (props.selectedGender === "all") return "all genders";
  return props.selectedGender === "male" ? "male beneficiaries" : "female beneficiaries";
});

const selectedSystemHpLabel = computed(() => {
  if (!props.showSystemHpFilter || props.selectedSystemHp === "all") return "";
  return props.selectedSystemHp === "1hp" ? "1 HP systems" : "2 HP systems";
});

const currentSelectionLabel = computed(() => {
  const parts = [selectedProjectInputLabel.value];
  if (props.selectedGender !== "all") {
    parts.push(props.selectedGender === "male" ? "Male" : "Female");
  }
  if (selectedSystemHpLabel.value) {
    parts.push(selectedSystemHpLabel.value);
  }
  return parts.join(" · ");
});

const overviewLabel = computed(() => {
  const parts = [selectedProjectInputLabel.value.toLowerCase(), selectedGenderLabel.value];
  if (selectedSystemHpLabel.value) {
    parts.push(selectedSystemHpLabel.value.toLowerCase());
  }
  return parts.join(" in ");
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
          props.selectedProjectInput,
          props.selectedGender,
          props.selectedSystemHp
      ).beneficiaries,
    }))
);

const activeSupportMixOptions = computed(() => {
  if (props.selectedProjectInput === "all") {
    return props.projectInputOptions;
  }

  return props.projectInputOptions.filter(
      (option) => option.id === props.selectedProjectInput
  );
});

const donutData = computed(() =>
    activeSupportMixOptions.value
    .map((option) => {
        const total = targetDistrictIds.value.reduce((sum, dId) => {
        const s = props.statsFor(
            dId,
            option.id,
            props.selectedGender,
            option.id === "solaririgation" ? props.selectedSystemHp : "all"
        );
        return sum + (s?.beneficiaries || 0);
      }, 0);

      return {
        id: option.id,
        category: option.label,
        value: total,
      };
    })
    .filter((item) => item.value > 0)
);

const supportMixTotal = computed(() =>
    donutData.value.reduce((sum, item) => sum + item.value, 0)
);

const statCards = computed(() => [
  {
    icon: "bi-people-fill",
    iconClass: "is-forest",
    value: props.currentStats.beneficiaries.toLocaleString(),
    label: "Beneficiaries Reached",
    detail: currentSelectionLabel.value
  },
  {
    icon: "bi-geo-alt-fill",
    iconClass: "is-emerald",
    value: activeDistricts.value.length.toLocaleString(),
    label: "Districts Covered",
    detail: currentDistrictLabel.value
  },
  {
    icon: "bi-gender-female",
    iconClass: "is-mint",
    value: `${props.currentStats.womenLed}%`,
    label: "Women Representation",
    detail: "Share of beneficiary households"
  },
  {
    icon: "bi-lightning-charge-fill",
    iconClass: "is-lime",
    value: "520 KW",
    label: "RE Generated",
    detail: "Total Kilowatts"
  },
  {
    icon: "bi-cloud-check-fill",
    iconClass: "is-olive",
    value: "525 MT",
    label: "CO₂ Reduce/Avoided",
    detail: "Total Tons"
  }
]);

const barChartDiv = ref<HTMLDivElement | null>(null);
const donutChartDiv = ref<HTMLDivElement | null>(null);

let barRoot: am5.Root | null = null;
let barSeries: am5xy.ColumnSeries | null = null;

let donutRoot: am5.Root | null = null;
let donutSeries: am5percent.PieSeries | null = null;

const amChartColors = () => CP4_SUPPORT_MIX_PALETTE.map((color) => am5.color(color));

const supportMixColorMap = computed(() =>
  getCP4SupportMixColorMap({
    projectInputOptions: props.projectInputOptions,
    selectedProjectInput: props.selectedProjectInput,
    selectedDistricts: props.selectedDistricts,
    districts: props.districts,
    selectedGender: props.selectedGender,
    selectedSystemHp: props.selectedSystemHp,
    statsFor: props.statsFor,
  })
);

const donutLegendItems = computed(() => {
  const total = supportMixTotal.value;

  return donutData.value.map((item) => ({
    category: item.category,
    percentage: total ? `${((item.value / total) * 100).toFixed(2)}%` : "0.00%",
    color: supportMixColorMap.value[item.id] || "#166534",
  }));
});

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
    cornerRadiusTL: 8,
    cornerRadiusTR: 8,
    fillOpacity: 0.9,
    strokeOpacity: 0,
    tooltipText: "{categoryX}: {valueY} beneficiaries",
  });

  barSeries.columns.template.adapters.add("fill", (_fill, target) => {
    const value = Number(target.dataItem?.get("valueY") ?? 0);
    const maxValue = Math.max(...barData.value.map((item) => item.value), 0);
    return am5.color(getMapTintShade(value, maxValue));
  });

  barSeries.columns.template.adapters.add("stroke", (_stroke, target) => {
    const value = Number(target.dataItem?.get("valueY") ?? 0);
    const maxValue = Math.max(...barData.value.map((item) => item.value), 0);
    return am5.color(getMapTintShade(value, maxValue));
  });

  xAxis.data.setAll(barData.value);
  barSeries.data.setAll(barData.value);
};

const updateBarChart = () => {
  if (!barSeries) return;
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
        tooltip: (() => {
          const tooltip = am5.Tooltip.new(donutRoot!, {
            pointerOrientation: "down",
            getFillFromSprite: false,
            getStrokeFromSprite: false,
            autoTextColor: false,
            labelText: "{category}: {value} beneficiaries",
          });

          tooltip.label.setAll({
            fontSize: 12,
            fontWeight: "500",
            fill: am5.color(0xffffff),
          });

          tooltip.get("background")?.setAll({
            fill: am5.color(0x17233c),
            fillOpacity: 0.96,
            strokeOpacity: 0,
            cornerRadiusTL: 10,
            cornerRadiusTR: 10,
            cornerRadiusBL: 10,
            cornerRadiusBR: 10,
          });

          return tooltip;
        })(),
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

  donutSeries.data.setAll(donutData.value);

  chart.appear(600, 100);
  donutSeries.appear(600);
};

const getMapTintShade = (count: number, maxCount: number) => {
  if (!count || maxCount <= 0) return 0xf0fdf4;
  const ratio = count / maxCount;
  if (ratio >= 0.85) return 0x16a34a;
  if (ratio >= 0.65) return 0x22c55e;
  if (ratio >= 0.45) return 0x4ade80;
  if (ratio >= 0.25) return 0x86efac;
  if (ratio >= 0.1) return 0xbbf7d0;
  return 0xdcfce7;
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

  barRoot = null;
  donutRoot = null;
  donutSeries = null;
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
  height: 220px;
}

.donut-chart-wrap .cp-chart-container {
  height: 220px;
}

.donut-center-total {
  position: absolute;
  left: 50%;
  top: 46%;
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

.jsb-donut-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.45rem 0.9rem;
  margin-top: 0.35rem;
}

.jsb-donut-legend__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem;
  min-width: 0;
  font-size: 0.56rem;
  line-height: 1.2;
}

.jsb-donut-legend__label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  color: #5f6f8a;
  flex: 1;
}

.jsb-donut-legend__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 9px;
  line-height: 1.25;
  font-weight: 400;
}

.jsb-donut-legend__swatch {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  flex: 0 0 9px;
}

.jsb-donut-legend__value {
  flex: 0 0 auto;
  min-width: 2.9rem;
  text-align: right;
  font-weight: 500;
  font-size: 9px;
  line-height: 1.25;
  color: #17233c;
}

.is-forest {
  background: #e7f6eb;
  color: #1f7a3f;
}

.is-emerald {
  background: #dcf7ee;
  color: #0f8f66;
}

.is-mint {
  background: #e9fbf2;
  color: #23a36a;
}

.is-lime {
  background: #f0f8dd;
  color: #6d9f12;
}

.is-olive {
  background: #eef4df;
  color: #5f7f1c;
}

@media (max-width: 640px) {
  .jsb-donut-legend {
    grid-template-columns: 1fr;
  }
}
</style>
