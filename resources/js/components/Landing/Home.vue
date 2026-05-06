<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PublicShell from "./PublicShell.vue";
import HomeMap from "./HomeMap.vue";
import FP1Filters from "../Projects/FP1/FP1Filters.vue";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import HomeFilters from "./HomeFilters.vue";

const selectedDistricts = ref<string[]>([]);
const selectedSubCategory = ref("all");
const showBeneficiaries = ref(true);
const showBoundaries = ref(true);
const homeMapLoading = ref(true);
const hasStartedInitialLoad = ref(false);
const hasCompletedInitialLoad = ref(false);

const HOME_BENEFICIARY_TYPE_NAME = "UNDP:JSBALL";

const getNumericValue = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeId = (value: string) =>
    value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

const formatProjectLabel = (value: string) => {
  const normalized = value.trim().toLowerCase();

  if (normalized === "foodsecurity" || normalized === "food-security") {
    return "Food Security";
  }

  const climatePromiseMatch = normalized.match(/^climate\s*promi(?:s|c)e\s*-?\s*(\d+)$/);

  if (climatePromiseMatch) {
    return `Climate Promise - ${climatePromiseMatch[1]}`;
  }

  return value;
};

const attributeRows = ref<Array<Record<string, string | number>>>([]);
const attributeTableLoading = ref(false);

const districts = computed(() => {
  const grouped = new Map<
      string,
      {
        id: string;
        name: string;
        latSum: number;
        lngSum: number;
        count: number;
      }
  >();

  attributeRows.value.forEach((row) => {
    const name = String(row.district ?? "").trim();
    if (!name) return;

    const key = normalizeId(name);
    const lat = getNumericValue(row.latitude);
    const lng = getNumericValue(row.longitude);

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key,
        name,
        latSum: 0,
        lngSum: 0,
        count: 0
      });
    }

    const district = grouped.get(key)!;
    district.latSum += lat;
    district.lngSum += lng;
    district.count += 1;
  });

  return Array.from(grouped.values())
      .map((district) => ({
        id: district.id,
        name: district.name,
        lat: district.count ? district.latSum / district.count : 7.9,
        lng: district.count ? district.lngSum / district.count : 80.6
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
});

const subCategories = computed(() => {
  const values = Array.from(
      new Set(
          attributeRows.value
              .map((row) => String(row.project ?? "").trim())
              .filter(Boolean)
      )
  ).sort((a, b) => a.localeCompare(b));

  return [
    { id: "all", label: "All Projects" },
    ...values.map((value) => ({
      id: value,
      label: formatProjectLabel(value)
    }))
  ];
});

const currentSubCategory = computed(
    () => subCategories.value.find((item) => item.id === selectedSubCategory.value) ?? subCategories.value[0]
);

const selectedProject = computed(() =>
    selectedSubCategory.value === "all" ? "" : selectedSubCategory.value
);

const selectedDistrictNameSet = computed(() =>
    new Set(
        activeDistricts.value.map((district) => district.name.trim().toLowerCase())
    )
);

const rowMatchesSelectedCategory = (row: Record<string, string | number>) => {
  return !selectedProject.value || String(row.project ?? "").trim() === selectedProject.value;
};

const rowMatchesSelectedDistricts = (row: Record<string, string | number>) => {
  if (!selectedDistricts.value.length) return true;

  const districtName = String(row.district ?? "").trim().toLowerCase();
  return selectedDistrictNameSet.value.has(districtName);
};

const rowsForCurrentSelection = computed(() =>
    attributeRows.value.filter(
        (row) => rowMatchesSelectedCategory(row) && rowMatchesSelectedDistricts(row)
    )
);

const currentStats = computed(() => {
  const rows = rowsForCurrentSelection.value;
  const beneficiaries = rows.length;

  const womenCount = rows.filter((row) => {
    const gender = String(row.gender ?? "").trim().toLowerCase();
    return ["female", "f", "woman", "women"].includes(gender);
  }).length;

  return {
    beneficiaries,
    womenLed: beneficiaries ? +((womenCount / beneficiaries) * 100).toFixed(1) : 0
  };
});

const chartPalette = [
  0x166534, // Green 800
  0x15803d, // Green 700
  0x16a34a, // Green 600
  0x22c55e, // Green 500
  0x65a30d, // Lime 600
  0x3f6212, // Lime 800
  0x047857 // Emerald 700
];
const statCards = computed(() => [
  {
    icon: "bi-people-fill",
    iconClass: "is-forest",
    value: currentStats.value.beneficiaries.toLocaleString(),
    label: "Beneficiaries Reached",
    detail: `${currentSubCategory.value.label} support`
  },
  {
    icon: "bi-geo-alt-fill",
    iconClass: "is-emerald",
    value: new Set(rowsForCurrentSelection.value.map((row) => row.district).filter(Boolean)).size.toLocaleString(),
    label: "Districts Covered",
    detail: "All Project Districts"
  },
  {
    icon: "bi-gender-female",
    iconClass: "is-mint",
    value: `${currentStats.value.womenLed}%`,
    label: "Women Representation",
    detail: "All Projects"
  },
  {
    icon: "bi-lightning-charge-fill",
    iconClass: "is-lime",
    value: "245 MW",
    label: "RE Generated",
    detail: "Total MegaWotts"
  },
  {
    icon: "bi-cloud-check-fill",
    iconClass: "is-olive",
    value: "525 MT",
    label: "CO₂ Reduce/Avoided",
    detail: "Total Tons"
  }
]);

const activeDistricts = computed(() =>
    selectedDistricts.value.length
        ? districts.value.filter((item) => selectedDistricts.value.includes(item.id))
        : districts.value
);

const districtChartData = computed(() =>
    activeDistricts.value.map((district) => ({
      district: district.name,
      value: rowsForCurrentSelection.value.filter(
          (row) => String(row.district ?? "").trim().toLowerCase() === district.name.toLowerCase()
      ).length
    }))
);

const supportMixData = computed(() =>
    Array.from(
        new Set(
            rowsForCurrentSelection.value
                .map((row) => String(row.project ?? "").trim())
                .filter(Boolean)
        )
    )
        .sort((a, b) => a.localeCompare(b))
        .map((project) => ({
          category: formatProjectLabel(project),
          rawCategory: project,
          value: rowsForCurrentSelection.value.filter(
              (row) => String(row.project ?? "").trim() === project
          ).length
        }))
);

const projectColorMap = computed<Record<string, string>>(() =>
    Object.fromEntries(
        supportMixData.value.map((item, index) => {
          const normalized = item.rawCategory.trim().toLowerCase();
          let color = chartPalette[index % chartPalette.length];

          if (normalized.includes("food")) {
            color = 0x16a34a;
          } else if (normalized.includes("climate")) {
            const climatePalette = [0x15803d, 0x22c55e, 0x65a30d, 0x166534, 0x3f6212, 0x047857];
            const climateHash = normalized
                .split("")
                .reduce((sum, char) => sum + char.charCodeAt(0), 0);
            color = climatePalette[climateHash % climatePalette.length];
          }

          return [item.rawCategory, `#${color.toString(16).padStart(6, "0")}`];
        })
    )
);

const filteredSupportMixData = computed(() =>
    supportMixData.value.filter((category) => category.value > 0)
);

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

const hasFilterOptions = computed(() =>
    districts.value.length > 0 && subCategories.value.length > 1
);

const isInitialSkeletonLoading = computed(() => {
  if (hasCompletedInitialLoad.value) return false;
  if (!hasStartedInitialLoad.value) return true;
  if (attributeTableLoading.value) return true;
  if (!attributeTableLoading.value && !attributeRows.value.length) return false;
  return homeMapLoading.value;
});

const districtProjectData = computed(() =>
    activeDistricts.value.map((district) => ({
      district: district.name,
      value: rowsForCurrentSelection.value.filter(
          (row) => String(row.district ?? "").trim().toLowerCase() === district.name.toLowerCase()
      ).length
    }))
);

const supportMixTotal = computed(() =>
    filteredSupportMixData.value.reduce((sum, item) => sum + item.value, 0)
);

const renewablePieChartData = computed(() => {
  const climateProjectNumbers = [2, 3, 4];
  const totals = new Map<number, number>(
      climateProjectNumbers.map((projectNumber) => [projectNumber, 0])
  );

  supportMixData.value.forEach((item) => {
    const projectMatch = item.rawCategory
        .trim()
        .toLowerCase()
        .match(/^climate\s*promi(?:s|c)e\s*-?\s*(\d+)$/);

    if (!projectMatch) return;

    const projectNumber = Number.parseInt(projectMatch[1], 10);

    if (!totals.has(projectNumber)) return;
    totals.set(projectNumber, item.value);
  });

  return climateProjectNumbers.map((projectNumber) => ({
    category: `Climate Promice - ${projectNumber}`,
    value: totals.get(projectNumber) ?? 0
  }));
});

const co2ProjectChartData = computed(() => {
  const climateProjectNumbers = [2, 3, 4];

  return climateProjectNumbers.map((projectNumber) => {
    const projectId = subCategories.value.find((item) => {
      if (item.id === "all") return false;

      return item.id
          .trim()
          .toLowerCase()
          .match(/^climate\s*promi(?:s|c)e\s*-?\s*(\d+)$/)?.[1] === String(projectNumber);
    })?.id;

    const metrics = projectId
        ? projectClimateMetrics.value[projectId]
        : undefined;

    const reduced = metrics?.co2Reduced ?? 0;
    const target = metrics?.co2Target ?? 0;

    return {
      category: `Climate Promice - ${projectNumber}`,
      reduced,
      remaining: Math.max(target - reduced, 0)
    };
  });
});

const projectClimateMetrics = computed(() => {
  const projectIds = subCategories.value
      .filter((item) => item.id !== "all")
      .map((item) => item.id);

  return Object.fromEntries(
      projectIds.map((projectId, index) => {
        const hash = projectId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) + index * 17;
        const solar = 30 + (hash % 28);
        const wind = 14 + (hash % 16);
        const biomass = 10 + (hash % 10);
        const hydro = 8 + (hash % 8);
        const co2Reduced = 180 + (hash % 420);
        const co2Target = co2Reduced + 120 + (hash % 180);

        return [projectId, {
          renewableMix: [
            { category: "Solar", value: solar },
            { category: "Wind", value: wind },
            { category: "Biomass", value: biomass },
            { category: "Hydro", value: hydro }
          ],
          co2Reduced,
          co2Target
        }];
      })
  );
});

const selectedProjectClimateMetrics = computed(() => {
  if (selectedProject.value) {
    return projectClimateMetrics.value[selectedProject.value] ?? {
      renewableMix: [],
      co2Reduced: 0,
      co2Target: 100
    };
  }

  const projectEntries = Object.values(projectClimateMetrics.value);

  if (!projectEntries.length) {
    return {
      renewableMix: [],
      co2Reduced: 0,
      co2Target: 100
    };
  }

  const renewableTotals = new Map<string, number>();

  projectEntries.forEach((project) => {
    project.renewableMix.forEach((item) => {
      renewableTotals.set(item.category, (renewableTotals.get(item.category) ?? 0) + item.value);
    });
  });

  return {
    renewableMix: Array.from(renewableTotals.entries()).map(([category, value]) => ({
      category,
      value
    })),
    co2Reduced: projectEntries.reduce((sum, item) => sum + item.co2Reduced, 0),
    co2Target: projectEntries.reduce((sum, item) => sum + item.co2Target, 0)
  };
});

const renewableEnergyTotal = computed(() =>
    selectedProjectClimateMetrics.value.renewableMix.reduce((sum, item) => sum + item.value, 0)
);

const co2StackedBarData = computed(() => co2ProjectChartData.value);

const currentDistrictLabel = computed(() => {
  if (!selectedDistricts.value.length) return "All districts";

  if (selectedDistricts.value.length === 1) {
    return districts.value.find((item) => item.id === selectedDistricts.value[0])?.name ?? "Selected district";
  }

  return "Multiple districts";
});

/* -------------------------------------------------------------------------- */
/*                              Attribute Table                               */
/* -------------------------------------------------------------------------- */

const attributeColumns = [
  { key: "fid", label: "fid" },
  { key: "district", label: "District" },
  { key: "dsd", label: "DSD" },
  { key: "gnd", label: "GND" },
  { key: "beneficiar", label: "Beneficiar" },
  { key: "nic", label: "NIC" },
  { key: "address", label: "Address" },
  { key: "phone_n", label: "Phone_n" },
  { key: "benefits_t", label: "Support Type" },
  { key: "project", label: "Project" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" }
];

const BENEFICIARY_WFS_URL = "https://geoserver.gsentry.cloud/geoserver/UNDP/wfs";

const fetchAttributeTable = async () => {
  hasStartedInitialLoad.value = true;
  attributeTableLoading.value = true;

  const query =
      `${BENEFICIARY_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature` +
      `&typeName=${HOME_BENEFICIARY_TYPE_NAME}&outputFormat=application/json&srsName=EPSG:4326` +
      `&propertyName=No,District,DSD,GND,Beneficiar,Gender,Age,NIC,Address,Phone_n,Latitude,Longitude,ProjectInp,Project` +
      `&maxFeatures=10000`;

  try {
    const response = await fetch(query);

    if (!response.ok) {
      throw new Error(`WFS request failed: ${response.status}`);
    }

    const data = await response.json();
    const features = Array.isArray(data.features) ? data.features : [];

    attributeRows.value = features.map((feature: any) => {
      const props = feature.properties || {};

      return {
        fid: feature.id || "",
        district: props.District || "",
        dsd: props.DSD || "",
        gnd: props.GND || "",
        beneficiar: props.Beneficiar || "",
        nic: props.NIC || "",
        address: props.Address || props.address || "",
        phone_n: props.Phone_n || props.Phone_Num || "",
        benefits_t: props.ProjectInp || props.Project || "",
        projectinp: props.ProjectInp || "",
        project: props.Project || "",
        latitude: props.Latitude || "",
        longitude: props.Longitude || "",
        age: props.Age || "",
        gender: props.Gender || ""
      };
    });
  } catch (error) {
    console.error("Failed to load attribute table", error);
    attributeRows.value = [];
  } finally {
    attributeTableLoading.value = false;
  }
};

/* -------------------------------------------------------------------------- */
/*                                amCharts                                    */
/* -------------------------------------------------------------------------- */

const barChartDiv = ref<HTMLDivElement | null>(null);
const donutChartDiv = ref<HTMLDivElement | null>(null);
const renewablePieChartDiv = ref<HTMLDivElement | null>(null);
const co2StackedBarChartDiv = ref<HTMLDivElement | null>(null);

let barRoot: am5.Root | null = null;
let barXAxis: am5xy.CategoryAxis<am5xy.AxisRendererX> | null = null;
let barSeries: am5xy.ColumnSeries | null = null;

let donutRoot: am5.Root | null = null;
let donutSeries: am5percent.PieSeries | null = null;
let donutLegend: am5.Legend | null = null;

let renewablePieRoot: am5.Root | null = null;
let renewablePieSeries: am5percent.PieSeries | null = null;
let renewablePieLegend: am5.Legend | null = null;

let co2StackedBarRoot: am5.Root | null = null;
let co2StackedBarYAxis: am5xy.CategoryAxis<am5xy.AxisRendererY> | null = null;
let co2StackedBarReducedSeries: am5xy.ColumnSeries | null = null;
let co2StackedBarRemainingSeries: am5xy.ColumnSeries | null = null;

const amChartColors = () => chartPalette.map((color) => am5.color(color));
const donutChartColors = () =>
    filteredSupportMixData.value.map((item) =>
        am5.color(Number.parseInt(projectColorMap.value[item.rawCategory].replace("#", ""), 16))
    );

const hideAmChartLogo = (root: am5.Root | null) => {
  if (!root) return;
  (root as any)._logo?.dispose();
};

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
        paddingLeft: 0
      })
  );

  chart.get("colors")?.set("colors", amChartColors());
  donutSeries?.get("colors")?.set("colors", amChartColors());
  const xRenderer = am5xy.AxisRendererX.new(barRoot, {
    minGridDistance: 15
  });

  xRenderer.grid.template.setAll({
    visible: false
  });

  xRenderer.labels.template.setAll({
    fontSize: 9,
    fill: am5.color(0x5f6f8a),
    oversizedBehavior: "truncate",
    maxWidth: 58,
    textAlign: "center",
    rotation: -35,
    centerY: am5.percent(50),
    centerX: am5.percent(100),
    paddingTop: 4
  });

  barXAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(barRoot, {
        categoryField: "district",
        renderer: xRenderer
      })
  );

  const yRenderer = am5xy.AxisRendererY.new(barRoot, {});

  yRenderer.labels.template.setAll({
    fontSize: 10,
    fill: am5.color(0x5f6f8a)
  });

  yRenderer.grid.template.setAll({
    strokeOpacity: 0.08
  });

  const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(barRoot, {
        min: 0,
        renderer: yRenderer
      })
  );

  barSeries = chart.series.push(
      am5xy.ColumnSeries.new(barRoot, {
        name: "Beneficiaries",
        xAxis: barXAxis,
        yAxis,
        valueYField: "value",
        categoryXField: "district"
      })
  );

  barSeries.columns.template.setAll({
    cornerRadiusTL: 8,
    cornerRadiusTR: 8,
    fillOpacity: 0.9,
    strokeOpacity: 0,
    tooltipText: "{categoryX}: {valueY} beneficiaries"
  });

  barSeries.columns.template.adapters.add("fill", (_fill, target) => {
    const value = Number(target.dataItem?.get("valueY") ?? 0);
    const maxValue = Math.max(...districtChartData.value.map((item) => item.value), 0);
    return am5.color(getMapTintShade(value, maxValue));
  });

  barSeries.columns.template.adapters.add("stroke", (_stroke, target) => {
    const value = Number(target.dataItem?.get("valueY") ?? 0);
    const maxValue = Math.max(...districtChartData.value.map((item) => item.value), 0);
    return am5.color(getMapTintShade(value, maxValue));
  });

  barXAxis.data.setAll(districtChartData.value);
  barSeries.data.setAll(districtChartData.value);

  chart.appear(600, 100);
  barSeries.appear(600);
};

const updateBarChart = () => {
  if (!barXAxis || !barSeries) return;

  barXAxis.data.setAll(districtChartData.value);
  barSeries.data.setAll(districtChartData.value);
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
        paddingLeft: 0
      })
  );

  chart.get("colors")?.set("colors", donutChartColors());

  donutSeries = chart.series.push(
      am5percent.PieSeries.new(donutRoot, {
        name: "Beneificiary Distribution",
        categoryField: "category",
        valueField: "value",
        tooltip: am5.Tooltip.new(donutRoot, {
          labelText: "{category}: {value} beneficiaries"
        })
      })
  );
  donutSeries.get("colors")?.set("colors", donutChartColors());

  donutSeries.slices.template.setAll({
    stroke: am5.color(0xffffff),
    strokeWidth: 2,
    strokeOpacity: 1,
    fillOpacity: 0.95
  });

  donutSeries.slices.template.states.create("hover", {
    scale: 1.03,
    fillOpacity: 1
  });

  donutSeries.labels.template.setAll({
    forceHidden: true
  });

  donutSeries.ticks.template.setAll({
    forceHidden: true
  });



  donutLegend = donutRoot.container.children.push(
      am5.Legend.new(donutRoot, {
        x: am5.percent(50),
        centerX: am5.percent(50),
        width: am5.percent(100),
        layout: donutRoot.gridLayout
      })
  );

  donutLegend.labels.template.setAll({
    fontSize: 9,
    fill: am5.color(0x5f6f8a),
    maxWidth: 105,
    oversizedBehavior: "truncate"
  });

  donutLegend.valueLabels.template.setAll({
    fontSize: 9,
    fill: am5.color(0x17233c),
    oversizedBehavior: "truncate"
  });

  donutLegend.markers.template.setAll({
    width: 9,
    height: 9
  });

  donutSeries.events.on("datavalidated", () => {
    if (donutSeries && donutLegend) {
      donutLegend.data.setAll(donutSeries.dataItems);
    }
  });

  donutSeries.data.setAll(filteredSupportMixData.value);

  chart.appear(600, 100);
  donutSeries.appear(600);
};
const updateDonutChart = () => {
  if (!donutSeries) return;

  donutSeries.get("colors")?.set("colors", donutChartColors());
  donutSeries.data.setAll(filteredSupportMixData.value);
};

const initRenewablePieChart = () => {
  if (!renewablePieChartDiv.value || renewablePieRoot) return;

  renewablePieRoot = am5.Root.new(renewablePieChartDiv.value);
  renewablePieRoot.setThemes([am5themes_Animated.new(renewablePieRoot)]);
  renewablePieRoot.container.set("layout", renewablePieRoot.verticalLayout);
  hideAmChartLogo(renewablePieRoot);

  const chart = renewablePieRoot.container.children.push(
      am5percent.PieChart.new(renewablePieRoot, {
        radius: am5.percent(72),
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0
      })
  );

  renewablePieSeries = chart.series.push(
      am5percent.PieSeries.new(renewablePieRoot, {
        name: "Renewable Energy",
        categoryField: "category",
        valueField: "value",
        tooltip: am5.Tooltip.new(renewablePieRoot, {
          labelText: "{category}: {value} kW"
        })
      })
  );

  renewablePieSeries.get("colors")?.set("colors", [
    am5.color(0x16a34a),
    am5.color(0x22c55e),
    am5.color(0x65a30d),
    am5.color(0x15803d)
  ]);

  renewablePieSeries.labels.template.setAll({ forceHidden: true });
  renewablePieSeries.ticks.template.setAll({ forceHidden: true });
  renewablePieSeries.slices.template.setAll({
    stroke: am5.color(0xffffff),
    strokeWidth: 2,
    strokeOpacity: 1
  });

  renewablePieLegend = renewablePieRoot.container.children.push(
      am5.Legend.new(renewablePieRoot, {
        x: am5.percent(50),
        centerX: am5.percent(50),
        width: am5.percent(100),
        layout: renewablePieRoot.gridLayout
      })
  );

  renewablePieLegend.labels.template.setAll({
    fontSize: 9,
    fill: am5.color(0x5f6f8a),
    maxWidth: 92,
    oversizedBehavior: "truncate"
  });

  renewablePieLegend.valueLabels.template.setAll({
    fontSize: 9,
    fill: am5.color(0x17233c)
  });

  renewablePieSeries.events.on("datavalidated", () => {
    if (renewablePieSeries && renewablePieLegend) {
      renewablePieLegend.data.setAll(renewablePieSeries.dataItems);
    }
  });

  renewablePieSeries.data.setAll(renewablePieChartData.value);
  chart.appear(600, 100);
  renewablePieSeries.appear(600);
};

const updateRenewablePieChart = () => {
  if (!renewablePieSeries) return;

  renewablePieSeries.data.setAll(renewablePieChartData.value);
};

const initCo2StackedBarChart = () => {
  if (!co2StackedBarChartDiv.value || co2StackedBarRoot) return;

  co2StackedBarRoot = am5.Root.new(co2StackedBarChartDiv.value);
  co2StackedBarRoot.setThemes([am5themes_Animated.new(co2StackedBarRoot)]);
  hideAmChartLogo(co2StackedBarRoot);

  const chart = co2StackedBarRoot.container.children.push(
      am5xy.XYChart.new(co2StackedBarRoot, {
        layout: co2StackedBarRoot.verticalLayout,
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingTop: 14,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 0
      })
  );

  const yRenderer = am5xy.AxisRendererY.new(co2StackedBarRoot, {});
  yRenderer.grid.template.setAll({ visible: false });
  yRenderer.labels.template.setAll({
    fontSize: 10,
    fill: am5.color(0x5f6f8a)
  });
  yRenderer.setAll({
    minGridDistance: 1,
    cellStartLocation: 0.18,
    cellEndLocation: 0.82
  });

  co2StackedBarYAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(co2StackedBarRoot, {
        categoryField: "category",
        renderer: yRenderer
      })
  );

  const xRenderer = am5xy.AxisRendererX.new(co2StackedBarRoot, {
    minGridDistance: 40
  });
  xRenderer.labels.template.setAll({
    fontSize: 10,
    fill: am5.color(0x5f6f8a)
  });
  xRenderer.grid.template.setAll({
    strokeOpacity: 0.08
  });

  const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(co2StackedBarRoot, {
        min: 0,
        renderer: xRenderer
      })
  );

  const createSeries = (name: string, field: "reduced" | "remaining", color: number) => {
    const series = chart.series.push(
        am5xy.ColumnSeries.new(co2StackedBarRoot!, {
          name,
          xAxis,
          yAxis: co2StackedBarYAxis!,
          valueXField: field,
          categoryYField: "category",
          stacked: true,
          tooltip: am5.Tooltip.new(co2StackedBarRoot!, {
            labelText: `${name}: {valueX} MT`
          })
        })
    );

    series.columns.template.setAll({
      height: 24,
      fill: am5.color(color),
      stroke: am5.color(color),
      strokeOpacity: 0,
      cornerRadiusTR: 8,
      cornerRadiusBR: 8,
      cornerRadiusTL: field === "reduced" ? 8 : 0,
      cornerRadiusBL: field === "reduced" ? 8 : 0
    });

    if (field === "reduced") {
      series.columns.template.adapters.add("fill", (_fill, target) => {
        const value = Number(target.dataItem?.get("valueX") ?? 0);
        const maxValue = Math.max(...co2StackedBarData.value.map((item) => item.reduced), 0);
        return am5.color(getMapTintShade(value, maxValue));
      });

      series.columns.template.adapters.add("stroke", (_stroke, target) => {
        const value = Number(target.dataItem?.get("valueX") ?? 0);
        const maxValue = Math.max(...co2StackedBarData.value.map((item) => item.reduced), 0);
        return am5.color(getMapTintShade(value, maxValue));
      });
    }

    series.data.setAll(co2StackedBarData.value);
    return series;
  };

  co2StackedBarReducedSeries = createSeries("Reduced / Avoided", "reduced", 0x16a34a);
  co2StackedBarRemainingSeries = createSeries("Remaining", "remaining", 0xe2e8f0);
  co2StackedBarYAxis.data.setAll(co2StackedBarData.value);

  const legend = chart.children.push(
      am5.Legend.new(co2StackedBarRoot, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 18
      })
  );

  legend.labels.template.setAll({
    fontSize: 10,
    fill: am5.color(0x5f6f8a)
  });

  legend.valueLabels.template.setAll({
    forceHidden: true
  });

  legend.data.setAll([co2StackedBarReducedSeries, co2StackedBarRemainingSeries]);

  chart.appear(600, 100);
  co2StackedBarReducedSeries.appear(600);
  co2StackedBarRemainingSeries.appear(600);
};

const updateCo2StackedBarChart = () => {
  if (!co2StackedBarYAxis || !co2StackedBarReducedSeries || !co2StackedBarRemainingSeries) return;

  co2StackedBarYAxis.data.setAll(co2StackedBarData.value);
  co2StackedBarReducedSeries.data.setAll(co2StackedBarData.value);
  co2StackedBarRemainingSeries.data.setAll(co2StackedBarData.value);
};

const initCharts = async () => {
  await nextTick();

  initBarChart();
  initDonutChart();
  initRenewablePieChart();
  initCo2StackedBarChart();
};

const disposeCharts = () => {
  barRoot?.dispose();
  donutRoot?.dispose();
  renewablePieRoot?.dispose();
  co2StackedBarRoot?.dispose();

  barRoot = null;
  barXAxis = null;
  barSeries = null;

  donutRoot = null;
  donutSeries = null;
  donutLegend = null;
  renewablePieRoot = null;
  renewablePieSeries = null;
  renewablePieLegend = null;
  co2StackedBarRoot = null;
  co2StackedBarYAxis = null;
  co2StackedBarReducedSeries = null;
  co2StackedBarRemainingSeries = null;
};

/* -------------------------------------------------------------------------- */
/*                              Hero Carousel                                 */
/* -------------------------------------------------------------------------- */


const heroSlides = [
  { src: "/images/carousel/Parangiya Pola.png",  alt: "Strengthening Smallholder Farmers and Micro/Home-Based Agriculture industries for Enhanced Food & Livelihood Security",  title: "Building Food Security through Climate-Resilient Agriculture" },
  { src: "/images/carousel/Building Food Security through Climate-Resilient Agriculture.JPG",  alt: "Building Food Security through Climate-Resilient Agriculture",title:"Building Food Security through Climate-Resilient Agriculture"},
  { src: "/images/carousel/Empowering Vulnarable Community 1.png", alt: "Empowering Vulnarable Community 1", title: "Empowering Vulnerable Communities" },
  { src: "/images/carousel/Vunrable.png", alt: "Empowering Vulnarable Community 1", title: "Empowering Vulnerable Communities" },
  // { src: "/images/carousel/Empowering Vulnarable Community 2.png", alt: "Empowering Vulnarable Community 2", title: "Empowering Vulnarable Community" },
  { src: "/images/carousel/clean energy and resilince livelyhood 1.png", alt: "Clean Energy and Resilince Livelhood", title: "Clean Energy for Resilient and Sustainable Rural Livelihoods\n"},
    // { src: "/images/carousel/clean energy.jpg", alt: "Clean Energy and Resilince Livelyhood", title: "Clean Energy and Resilince Livelyhood" },

];

const currentHeroSlide = ref(0);
let heroTimer: ReturnType<typeof setInterval> | null = null;

const startHeroAutoplay = () => {
  if (heroTimer) return;

  heroTimer = setInterval(() => {
    currentHeroSlide.value = (currentHeroSlide.value + 1) % heroSlides.length;
  }, 6000);
};

const stopHeroAutoplay = () => {
  if (!heroTimer) return;

  clearInterval(heroTimer);
  heroTimer = null;
};

const goToHeroSlide = (index: number) => {
  currentHeroSlide.value = index;
};

/* -------------------------------------------------------------------------- */
/*                              Lifecycle                                     */
/* -------------------------------------------------------------------------- */

onMounted(() => {
  startHeroAutoplay();
  fetchAttributeTable();
  initCharts();
});

onBeforeUnmount(() => {
  stopHeroAutoplay();
  disposeCharts();
});

watch(
    () => [selectedSubCategory.value, selectedDistricts.value.join(",")],
    () => {
      if (!subCategories.value.some((item) => item.id === selectedSubCategory.value)) {
        selectedSubCategory.value = "all";
      }
    }
);

watch(districtChartData, () => {
  updateBarChart();
});

watch(filteredSupportMixData, () => {
  updateDonutChart();
});

watch(renewablePieChartData, () => {
  updateRenewablePieChart();
});

watch(selectedProjectClimateMetrics, () => {
  updateCo2StackedBarChart();
});

watch(isInitialSkeletonLoading, async (loading) => {
  if (loading) return;

  await initCharts();
  updateBarChart();
  updateDonutChart();
  updateRenewablePieChart();
  updateCo2StackedBarChart();
});

watch(
    () => ({
      hasStarted: hasStartedInitialLoad.value,
      attributeLoading: attributeTableLoading.value,
      mapLoading: homeMapLoading.value,
      rowCount: attributeRows.value.length
    }),
    ({ hasStarted, attributeLoading, mapLoading, rowCount }) => {
      if (hasCompletedInitialLoad.value) return;
      if (!hasStarted) return;
      if (attributeLoading) return;

      if (rowCount === 0 || !mapLoading) {
        hasCompletedInitialLoad.value = true;
      }
    },
    { immediate: true }
);
</script>

<template>
  <PublicShell>
    <div class="jsb-dashboard-content">
      <section
          class="jsb-hero-carousel"
          aria-label="Homepage image carousel"
          @mouseenter="stopHeroAutoplay"
          @mouseleave="startHeroAutoplay"
      >
          <div
              v-for="(slide, index) in heroSlides"
              :key="slide.src"
              class="jsb-hero-carousel__slide"
              :class="{ 'is-active-slide': currentHeroSlide === index }"
          >
            <div
                class="jsb-hero-carousel__bg"
                :style="{ backgroundImage: `url('${slide.src}')` }"
            ></div>
            <div
                class="jsb-hero-carousel__bg-blur"
                :style="{ backgroundImage: `url('${slide.src}')` }"
            ></div>
            <div class="jsb-hero-carousel__content-wrap" v-if="slide.title">
              <div class="jsb-hero-carousel__content">
                <h2 class="jsb-hero-carousel__title">{{ slide.title }}</h2>
                <p v-if="slide.description" class="jsb-hero-carousel__desc delay-1">{{ slide.description }}</p>
              </div>
            </div>
          </div>

        <div class="jsb-hero-carousel__dots" aria-label="Carousel navigation">
          <button
              v-for="(slide, index) in heroSlides"
              :key="`${slide.src}-dot`"
              type="button"
              class="jsb-hero-carousel__dot"
              :class="{ 'is-active': index === currentHeroSlide }"
              :aria-label="`Show slide ${index + 1}`"
              @click="goToHeroSlide(index)"
          ></button>
        </div>
      </section>

      <section class="jsb-stats-grid" aria-label="Key statistics">
        <template v-if="isInitialSkeletonLoading">
          <article
              v-for="index in 5"
              :key="`stat-skeleton-${index}`"
              class="jsb-stat-card jsb-stat-card--skeleton"
          >
            <span class="jsb-skeleton jsb-skeleton--icon"></span>

            <div class="jsb-stat-card__content">
              <span class="jsb-skeleton jsb-skeleton--value"></span>
              <span class="jsb-skeleton jsb-skeleton--label"></span>
              <span class="jsb-skeleton jsb-skeleton--detail"></span>
            </div>
          </article>
        </template>

        <article
            v-else
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

      <section class="jsb-panel jsb-panel--filters" aria-label="Homepage filters">
        <div v-if="!hasFilterOptions && isInitialSkeletonLoading" class="jsb-filter-skeleton-grid">
          <div
              v-for="index in 4"
              :key="`filter-skeleton-${index}`"
              class="jsb-filter-skeleton-card"
          >
            <span class="jsb-skeleton jsb-skeleton--filter-title"></span>
            <span class="jsb-skeleton jsb-skeleton--filter-control"></span>
            <span v-if="index > 2" class="jsb-skeleton jsb-skeleton--filter-control jsb-skeleton--filter-control-short"></span>
          </div>
        </div>

        <HomeFilters
            v-else
            :districts="districts"
            :sub-categories="subCategories"
            :selected-districts="selectedDistricts"
            :selected-sub-category="selectedSubCategory"
            :show-beneficiaries="showBeneficiaries"
            :show-boundaries="showBoundaries"
            :dashboard-mode="true"
            @update:selected-districts="selectedDistricts = $event"
            @update:selected-sub-category="selectedSubCategory = $event"
            @update:show-beneficiaries="showBeneficiaries = $event"
            @update:show-boundaries="showBoundaries = $event"
        />
      </section>

      <section class="jsb-dashboard-grid">
        <article class="jsb-panel jsb-panel--overview">
          <div class="jsb-panel__header">
            <div>
              <h2>Project Overview</h2>
            </div>
          </div>

          <div class="jsb-overview-visuals">
            <div class="jsb-mini-panel">
              <div class="jsb-mini-panel__title">Beneficiaries by District</div>

              <div class="jsb-chart-shell">
                <div v-show="isInitialSkeletonLoading" class="jsb-chart-skeleton">
                  <span class="jsb-skeleton jsb-skeleton--chart"></span>
                </div>
                <div ref="barChartDiv" v-show="!isInitialSkeletonLoading" class="cp-chart-container"></div>
              </div>
            </div>

            <div class="jsb-mini-panel">
              <div class="jsb-mini-panel__title">Beneificiary Distribution</div>

              <div class="jsb-chart-shell">
                <div v-show="isInitialSkeletonLoading" class="jsb-chart-skeleton">
                  <span class="jsb-skeleton jsb-skeleton--chart jsb-skeleton--chart-round"></span>
                </div>
                <div v-show="!isInitialSkeletonLoading" class="donut-chart-wrap">
                  <div ref="donutChartDiv" class="cp-chart-container"></div>

                  <div class="donut-center-total">
                    <strong>{{ supportMixTotal.toLocaleString() }}</strong>
                    <span>Total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="jsb-overview-line">
            <div class="jsb-overview-line-grid">
              <div class="jsb-mini-panel">
                <div class="jsb-mini-panel__title">Renewable Energy</div>

                <div class="jsb-chart-shell">
                  <div v-show="isInitialSkeletonLoading" class="jsb-chart-skeleton">
                    <span class="jsb-skeleton jsb-skeleton--chart jsb-skeleton--chart-round"></span>
                  </div>
                  <div v-show="!isInitialSkeletonLoading" class="jsb-pie-chart-wrap">
                    <div ref="renewablePieChartDiv" class="cp-chart-container"></div>
                  </div>
                </div>
              </div>

              <div class="jsb-mini-panel">
                <div class="jsb-mini-panel__title">CO₂ Reduced / Avoided</div>

                <div class="jsb-chart-shell">
                  <div v-show="isInitialSkeletonLoading" class="jsb-chart-skeleton">
                    <span class="jsb-skeleton jsb-skeleton--chart"></span>
                  </div>
                  <div v-show="!isInitialSkeletonLoading" class="jsb-co2-stack-wrap">
                    <div ref="co2StackedBarChartDiv" class="cp-chart-container cp-chart-container--stacked"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article class="jsb-panel jsb-panel--map">
          <div class="jsb-map-card">
            <HomeMap
                :districts="districts"
                :selected-districts="selectedDistricts"
                :selected-sub-category="selectedSubCategory"
                :project-colors="projectColorMap"
                :show-beneficiaries="showBeneficiaries"
                :show-boundaries="showBoundaries"
                :embedded="true"
                @loading-state="homeMapLoading = $event"
            />

            <div v-if="isInitialSkeletonLoading" class="jsb-map-loading-overlay">
              <div class="jsb-map-loading-card">
                <span class="jsb-skeleton jsb-skeleton--map-title"></span>
                <span class="jsb-skeleton jsb-skeleton--map-line"></span>
                <span class="jsb-skeleton jsb-skeleton--map-line jsb-skeleton--map-line-short"></span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!--
      <section class="jsb-panel jsb-panel--table">
        <div class="jsb-panel__header">
          <div>
            <h2>Attribute Table</h2>
            <p>
              Sample records from <strong>UNDP:all_benefics</strong> for
              {{ currentSubCategory.label.toLowerCase() }} in {{ currentDistrictLabel.toLowerCase() }}.
            </p>
          </div>
        </div>

        <div v-if="attributeTableLoading" class="jsb-table-state">
          Loading attribute table...
        </div>

        <div v-else-if="!attributeRows.length" class="jsb-table-state">
          No beneficiary records matched the current filter.
        </div>

        <div v-else class="jsb-table-wrap">
          <table class="jsb-attribute-table">
            <thead>
              <tr>
                <th v-for="column in attributeColumns" :key="column.key">
                  {{ column.label }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(row, index) in attributeRows" :key="`${row.fid}-${index}`">
                <td v-for="column in attributeColumns" :key="column.key">
                  {{ row[column.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      -->
    </div>
  </PublicShell>
</template>

<style scoped>
.jsb-dashboard-page {
  min-height: 100vh;
  padding: 0;
  background:
      radial-gradient(circle at top left, rgba(45, 116, 225, 0.14), transparent 28%),
      linear-gradient(180deg, #eef4fb 0%, #f5f8fc 100%);
  color: #17233c;
  font-family: "Poppins", sans-serif;
}

.jsb-dashboard-shell {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-height: 100vh;
}

.jsb-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 14px 18px;
  background: linear-gradient(180deg, #005cbf 0%, #0b57b1 44%, #0d4a96 100%);
  color: #fff;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.08);
}

.jsb-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 6px 10px;
}

.jsb-sidebar__logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 92px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 4px;
}

.jsb-sidebar__logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.jsb-sidebar__brand-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.95);
}

.jsb-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jsb-sidebar__link,
.jsb-sidebar__logout,
.jsb-sidebar__promo-link {
  text-decoration: none;
}

.jsb-sidebar__link {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.92);
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.jsb-sidebar__link i,
.jsb-sidebar__logout i {
  font-size: 1rem;
}

.jsb-sidebar__link:hover,
.jsb-sidebar__link.is-active {
  background: linear-gradient(180deg, rgba(79, 156, 255, 0.95), rgba(45, 129, 240, 0.95));
  transform: translateX(2px);
}

.jsb-sidebar__promo {
  margin-top: auto;
  padding: 20px 16px 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  backdrop-filter: blur(8px);
}

.jsb-sidebar__promo h3 {
  margin: 0 0 10px;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #fff;
}

.jsb-sidebar__promo p {
  margin: 0 0 18px;
  font-size: 0.94rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
}

.jsb-sidebar__promo-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 14px;
  color: #fff;
}

.jsb-sidebar__logout {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.9);
}

.jsb-dashboard-main {
  padding: 18px 22px 24px;
}

.jsb-topbar,
.jsb-stat-card,
.jsb-panel,
.jsb-mini-panel,
.jsb-quick-link {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(16, 24, 40, 0.06);
  box-shadow: 0 10px 40px rgba(16, 24, 40, 0.06);
}

.jsb-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 22px;
  border-radius: 22px;
}

.jsb-topbar__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.jsb-topbar__flag-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 32px;
  border: 1px solid rgba(16, 24, 40, 0.12);
  border-radius: 6px;
}

.jsb-topbar__flag {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.jsb-topbar__brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jsb-topbar__brand-copy span {
  font-size: 0.72rem;
  color: #6a7487;
  letter-spacing: 0.08em;
}

.jsb-topbar__brand-copy strong {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f1f3d;
}

.jsb-topbar__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.jsb-topbar__nav-link {
  position: relative;
  padding: 8px 2px 14px;
  color: #51607b;
  text-decoration: none;
  font-size: 0.96rem;
  font-weight: 500;
}

.jsb-topbar__nav-link.is-active {
  color: #1c63d6;
}

.jsb-topbar__nav-link.is-active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2a7bf3, #1a55c5);
}

.jsb-topbar__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.jsb-icon-button {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #4f5f7d;
}

.jsb-topbar__profile {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4f5f7d;
  font-weight: 500;
}

.jsb-topbar__avatar {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background:
      linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)),
      url("/images/jsb-dashboard-reference.jpeg") no-repeat;
  background-size: 1536px auto;
  background-position: calc(100% - 92px) -32px;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.85);
}

.jsb-dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
}

.jsb-hero-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  width: 100%;
  height: clamp(500px, 58vh, 760px);
  background: #0f1f37;
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.08);
}

.jsb-hero-carousel__slide {
  position: relative;
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 1s ease, visibility 1s ease;
  display: flex;
  align-items: center;
}

.jsb-hero-carousel__slide.is-active-slide {
  opacity: 1;
  visibility: visible;
}

.jsb-hero-carousel__bg {
  position: absolute;
  inset: 0;
  background-size: 65%;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
  transform: scale(1.02);
  transition: transform 6s ease;
}

.jsb-hero-carousel__bg-blur {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(22px);
  transform: scale(1.12);
  opacity: 0.95;
  z-index: 0;
}

.jsb-hero-carousel__slide.is-active-slide .jsb-hero-carousel__bg {
  transform: scale(1);
}

.jsb-hero-carousel__content-wrap {
  position: relative;
  z-index: 2;
  padding: 3rem;
  width: 100%;
  display: flex;
}

.jsb-hero-carousel__content {
  max-width: 48rem;
}

.jsb-hero-carousel__title {
  color: #ffffff;
  margin: 0 0 1.25rem;
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(20px);
}

.jsb-hero-carousel__desc {
  font-size: clamp(1.05rem, 1.5vw, 1.25rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  max-width: 42rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin: 0;
  opacity: 0;
  transform: translateY(20px);
}

.jsb-hero-carousel__slide.is-active-slide .jsb-hero-carousel__title,
.jsb-hero-carousel__slide.is-active-slide .jsb-hero-carousel__desc {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.jsb-hero-carousel__slide.is-active-slide .jsb-hero-carousel__title {
  animation-delay: 0.4s;
}

.jsb-hero-carousel__slide.is-active-slide .jsb-hero-carousel__desc.delay-1 {
  animation-delay: 0.6s;
}

@keyframes slideUpFade {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.jsb-hero-carousel__dots {
  position: absolute;
  bottom: 2rem;
  left: 3rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.jsb-hero-carousel__dot {
  width: 32px;
  height: 4px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.jsb-hero-carousel__dot.is-active {
  background: #ffffff;
}

.jsb-stats-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.jsb-stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 18px;
  border-radius: 20px;
}

.jsb-stat-card--skeleton {
  pointer-events: none;
}

.jsb-stat-card__icon,
.jsb-overview-stat__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 50%;
}

.jsb-stat-card__icon {
  width: 58px;
  height: 58px;
  font-size: 1.7rem;
}

.jsb-stat-card__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jsb-stat-card__content strong {
  font-size: 1.72rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #12233f;
}

.jsb-stat-card__content span {
  font-size: 0.88rem;
  color: #4e5d78;
}

.jsb-stat-card__content small {
  font-size: 0.76rem;
  color: #0c8c5c;
}

.jsb-skeleton {
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(90deg, #edf2f8 0%, #f8fbff 50%, #edf2f8 100%);
  background-size: 200% 100%;
  animation: jsb-skeleton-shimmer 1.4s ease-in-out infinite;
}

.jsb-skeleton--icon {
  width: 58px;
  height: 58px;
  border-radius: 50%;
}

.jsb-skeleton--value {
  width: 92px;
  height: 26px;
}

.jsb-skeleton--label {
  width: 150px;
  height: 14px;
  margin-top: 6px;
}

.jsb-skeleton--detail {
  width: 130px;
  height: 12px;
  margin-top: 6px;
}

.jsb-dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(360px, 0.92fr);
  gap: 16px;
}

.jsb-panel {
  border-radius: 24px;
  padding: 18px;
}

.jsb-panel--filters {
  padding: 12px 16px;
}

.jsb-filter-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.jsb-filter-skeleton-card {
  padding: 18px 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfdff 0%, #f4f8fd 100%);
  border: 1px solid rgba(16, 24, 40, 0.06);
}

.jsb-skeleton--filter-title {
  display: block;
  width: 96px;
  height: 12px;
  margin-bottom: 14px;
}

.jsb-skeleton--filter-control {
  display: block;
  width: 100%;
  height: 42px;
  border-radius: 12px;
}

.jsb-skeleton--filter-control-short {
  margin-top: 10px;
  width: 72%;
}

.jsb-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.jsb-panel__header h2 {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #12233f;
}

.jsb-panel__header p {
  margin: 6px 0 0;
  max-width: 500px;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #62708a;
}

.jsb-select-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  border-radius: 12px;
  background: #fff;
  color: #55627c;
}

.jsb-overview-visuals {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 14px;
}

.jsb-overview-line {
  margin-top: 14px;
}

.jsb-overview-line-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.jsb-mini-panel {
  border-radius: 18px;
  padding: 14px;
}

.jsb-mini-panel__title {
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 700;
  color: #162746;
}

.jsb-chart-shell {
  min-height: 280px;
  padding: 12px 12px 8px;
  border: 1px solid rgba(16, 24, 40, 0.05);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
  overflow: hidden;
}

.jsb-chart-skeleton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 260px;
}

.jsb-skeleton--chart {
  width: 100%;
  height: 100%;
  border-radius: 18px;
}

.jsb-skeleton--chart-round {
  width: min(240px, 100%);
  height: min(240px, 100%);
  border-radius: 50%;
}

.cp-chart-container {
  width: 100%;
  height: 260px;
}

.cp-chart-container--stacked {
  height: 300px;
}

.jsb-dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(360px, 0.92fr);
  gap: 16px;
  align-items: stretch;
}

.jsb-panel--map {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.jsb-map-card {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(180deg, #d6ecff 0%, #cee7fd 100%);
  padding: 0;
  overflow: hidden;
}

.jsb-map-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(243, 248, 255, 0.72);
  backdrop-filter: blur(6px);
  z-index: 2;
}

.jsb-map-loading-card {
  width: min(320px, 100%);
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 40px rgba(18, 35, 63, 0.12);
}

.jsb-skeleton--map-title {
  width: 140px;
  height: 18px;
  margin-bottom: 14px;
}

.jsb-skeleton--map-line {
  display: block;
  width: 100%;
  height: 12px;
  margin-bottom: 10px;
}

.jsb-skeleton--map-line-short {
  width: 72%;
  margin-bottom: 0;
}

:deep(.cp-map-section) {
  padding: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex: 1;
}

:deep(.cp-map-card) {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
}

:deep(.cp-map-card--embedded) {
  padding: 0;
}

:deep(.cp-map) {
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1 1 auto;
  margin-top: 0;
  border-radius: 20px;
}

:deep(.jsb-panel--filters .container) {
  width: 100%;
  max-width: none;
  padding: 0;
}

:deep(.jsb-panel--filters .filters) {
  gap: 12px;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

:deep(.jsb-panel--filters .filter-card) {
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfdff 0%, #f4f8fd 100%);
  border: 1px solid rgba(16, 24, 40, 0.06);
  box-shadow: none;
}

.jsb-panel--table {
  overflow: hidden;
}

.jsb-table-wrap {
  overflow: auto;
  border: 1px solid rgba(16, 24, 40, 0.07);
  border-radius: 18px;
}

.jsb-attribute-table {
  width: 100%;
  min-width: 1280px;
  border-collapse: collapse;
  background: #fff;
}

.jsb-attribute-table th,
.jsb-attribute-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #e8edf5;
  text-align: left;
  vertical-align: top;
  font-size: 0.84rem;
  color: #40506b;
}

.jsb-attribute-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f5f8fc;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #55627c;
}

.jsb-attribute-table tbody tr:nth-child(even) {
  background: #fbfdff;
}

.jsb-table-state {
  padding: 32px 16px;
  border: 1px dashed rgba(16, 24, 40, 0.12);
  border-radius: 18px;
  text-align: center;
  color: #6a7487;
  background: #fbfdff;
}

.is-blue {
  background: #e7f1ff;
  color: #1764d8;
}

.is-sky {
  background: #e8f4ff;
  color: #2376f3;
}

.is-violet {
  background: #efe9ff;
  color: #7558ef;
}

.is-teal {
  background: #dff7f4;
  color: #10958c;
}

.is-green {
  background: #eaf8e8;
  color: #24a249;
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

.is-amber {
  background: #fff2df;
  color: #f09a2d;
}

@keyframes jsb-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1199px) {
  .jsb-stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .jsb-filter-skeleton-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 991px) {
  .jsb-dashboard-shell {
    grid-template-columns: 1fr;
  }

  .jsb-sidebar {
    gap: 18px;
  }

  .jsb-sidebar__promo {
    margin-top: 0;
  }

  .jsb-topbar,
  .jsb-topbar__nav,
  .jsb-topbar__actions {
    flex-wrap: wrap;
  }

  .jsb-filter-skeleton-grid,
  .jsb-dashboard-grid,
  .jsb-overview-visuals,
  .jsb-overview-line-grid {
    grid-template-columns: 1fr;
  }

  .jsb-stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 860px) {
  .jsb-hero-carousel {
    margin-inline: 8px;
    height: 460px;
  }

  .jsb-hero-carousel__content-wrap {
    padding: 2rem;
  }

  .jsb-hero-carousel__title {
    font-size: clamp(1.7rem, 7vw, 2.2rem);
  }

  .jsb-hero-carousel__desc {
    font-size: 0.98rem;
  }

  .jsb-hero-carousel__dots {
    left: 2rem;
    bottom: 1.5rem;
  }

  .jsb-stats-grid {
    grid-template-columns: 1fr;
    margin-inline: 8px;
  }

  .jsb-stat-card {
    width: 100%;
  }

  .jsb-panel--map {
    min-height: 420px;
  }

  .jsb-map-card {
    min-height: 420px;
    height: 420px;
  }

  :deep(.cp-map) {
    height: 420px;
    min-height: 420px;
  }
}

.donut-chart-wrap {
  position: relative;
  width: 100%;
  height: 260px;
}

.jsb-pie-chart-wrap {
  width: 100%;
  height: 260px;
}

.donut-chart-wrap .cp-chart-container {
  height: 260px;
}

.jsb-pie-chart-wrap .cp-chart-container {
  height: 260px;
}

.donut-center-total {
  position: absolute;
  left: 50%;
  top: 44%;
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

.jsb-co2-stack-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 360px;
}

.jsb-co2-stack-summary {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.jsb-co2-stack-summary strong {
  font-size: 1.35rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #17233c;
}

.jsb-co2-stack-summary span {
  margin-top: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7a90;
}
</style>
