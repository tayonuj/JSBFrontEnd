import { ref, computed } from "vue";

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

const BENEFICIARY_WFS_URL =
    "https://geoserver.gsentry.cloud/geoserver/UNDP/wfs";

const BENEFICIARY_LAYER_NAME = "UNDP:jsb3";

const ENERGY_FILTER_IDS = ["cookstove", "biogas", "solar"];
const GENDER_FILTER_IDS = ["male", "female"];
const SOLAR_BENEFICIARY_FILTER_IDS = ["school", "hospital", "household"];

const emptyStat = (): Stat => ({
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

export function useCP3Data() {
    const districts = [
        {
            id: "mullaitivu",
            name: "Mullaitivu",
            lat: 9.201845,
            lng: 80.666083,
        },
    ];

    const dsDivisions = [
        {
            id: "maritimepattu",
            name: "Maritimepattu",
            count: 13,
            lat: 9.15353,
            lng: 80.855176,
        },
        {
            id: "oddusuddan",
            name: "Oddusuddan",
            count: 64,
            lat: 9.162024,
            lng: 80.648076,
        },
        {
            id: "puthukudiyiruppu",
            name: "Puthukudiyiruppu",
            count: 23,
            lat: 9.339248,
            lng: 80.612797,
        },
    ];

    const selectedDistricts = ref<string[]>(["mullaitivu"]);

    // Fixed filter chips:
    // cookstove, biogas, solar, male, female, school, hospital, household
    const selectedFilters = ref<string[]>([]);

    const showBeneficiaries = ref(true);
    const showBoundaries = ref(true);

    const allFeatures = ref<any[]>([]);
    const isStatsLoading = ref(false);

    const normalizeValue = (value: any) =>
        String(value ?? "").trim().toLowerCase();

    const getBeneficiaryType = (beneficiar: any) => {
        const value = normalizeValue(beneficiar);

        if (value === "hospital") return "hospital";
        if (value === "school") return "school";

        return "household";
    };

    const districtIdToName = (districtId: string) => {
        return districts.find((district) => district.id === districtId)?.name || "";
    };

    const matchesDistrict = (properties: any, districtIds: string[]) => {
        if (!districtIds.length) return true;

        const districtName = normalizeValue(properties?.District);

        return districtIds.some((districtId) => {
            const selectedDistrictName = normalizeValue(districtIdToName(districtId));
            return districtName === selectedDistrictName;
        });
    };

    const matchesFilters = (properties: any, filtersInput: string[]) => {
        const filters = (filtersInput || []).map(normalizeValue).filter(Boolean);

        if (!filters.length) return true;

        const energyFilters = filters.filter((value) =>
            ENERGY_FILTER_IDS.includes(value)
        );

        const genderFilters = filters.filter((value) =>
            GENDER_FILTER_IDS.includes(value)
        );

        const solarBeneficiaryFilters = filters.filter((value) =>
            SOLAR_BENEFICIARY_FILTER_IDS.includes(value)
        );

        const energy = normalizeValue(properties?.Energy);
        const gender = normalizeValue(properties?.Gender);
        const beneficiaryType = getBeneficiaryType(properties?.Beneficiar);

        if (energyFilters.length && !energyFilters.includes(energy)) {
            return false;
        }

        if (genderFilters.length && !genderFilters.includes(gender)) {
            return false;
        }

        if (
            filters.includes("solar") &&
            energy === "solar" &&
            solarBeneficiaryFilters.length &&
            !solarBeneficiaryFilters.includes(beneficiaryType)
        ) {
            return false;
        }

        return true;
    };

    const buildWfsUrl = () => {
        const params = new URLSearchParams({
            service: "WFS",
            version: "1.1.0",
            request: "GetFeature",
            typeName: BENEFICIARY_LAYER_NAME,
            outputFormat: "application/json",
            srsName: "EPSG:4326",
            maxFeatures: "5000",
        });

        return `${BENEFICIARY_WFS_URL}?${params.toString()}`;
    };

    const loadStatsData = async () => {
        isStatsLoading.value = true;

        try {
            const response = await fetch(buildWfsUrl());
            const text = await response.text();

            if (!response.ok) {
                console.error("Stats WFS request failed", response.status, response.statusText);
                console.error(text);
                allFeatures.value = [];
                return;
            }

            if (text.trim().startsWith("<")) {
                console.error("Stats WFS returned XML instead of GeoJSON");
                console.error(text);
                allFeatures.value = [];
                return;
            }

            const geojson = JSON.parse(text);
            allFeatures.value = Array.isArray(geojson?.features) ? geojson.features : [];
        } catch (error) {
            console.error("Error loading stats WFS data", error);
            allFeatures.value = [];
        } finally {
            isStatsLoading.value = false;
        }
    };

    const getFilteredFeatures = (districtIds: string[]) => {
        return allFeatures.value.filter((feature) => {
            const properties = feature?.properties || {};

            return (
                matchesDistrict(properties, districtIds) &&
                matchesFilters(properties, selectedFilters.value)
            );
        });
    };

    const calculateStats = (features: any[]): Stat => {
        if (!features.length) return emptyStat();

        let femaleCount = 0;
        let youthCount = 0;

        const supportMix: SupportMix = {
            cookstove: 0,
            biogas: 0,
            solar: 0,
        };

        features.forEach((feature) => {
            const properties = feature?.properties || {};

            const gender = normalizeValue(properties?.Gender);
            const age = Number(properties?.Age);
            const energy = normalizeValue(properties?.Energy);

            if (gender === "female") {
                femaleCount += 1;
            }

            if (Number.isFinite(age) && age >= 18 && age <= 35) {
                youthCount += 1;
            }

            if (energy === "cookstove") {
                supportMix.cookstove += 1;
            } else if (energy === "biogas") {
                supportMix.biogas += 1;
            } else if (energy === "solar") {
                supportMix.solar += 1;
            }
        });

        const total = features.length;

        return {
            beneficiaries: total,
            supportValue: total,
            womenLed: +((femaleCount / total) * 100).toFixed(1),
            youth: +((youthCount / total) * 100).toFixed(1),
            supportMix,
        };
    };

    const statsFor = (districtId: string): Stat => {
        const features = getFilteredFeatures([districtId]);
        return calculateStats(features);
    };

    const statsForMultiple = (districtIds: string[]): Stat => {
        const ids = districtIds.length ? districtIds : districts.map((district) => district.id);
        const features = getFilteredFeatures(ids);
        return calculateStats(features);
    };

    const currentStats = computed<Stat>(() => {
        return statsForMultiple(selectedDistricts.value);
    });

    const dsdChartData = computed<DsdChartItem[]>(() => {
        const districtIds = selectedDistricts.value || [];
        const ids = districtIds.length ? districtIds : districts.map((district) => district.id);

        const features = getFilteredFeatures(ids);
        const dsdCounts = new Map<string, number>();

        features.forEach((feature) => {
            const properties = feature?.properties || {};
            const dsd = String(properties?.DSD ?? "").trim();

            if (!dsd) return;

            dsdCounts.set(dsd, (dsdCounts.get(dsd) || 0) + 1);
        });

        return Array.from(dsdCounts.entries())
            .map(([dsd, value]) => ({
                dsd,
                value,
            }))
            .sort((a, b) => b.value - a.value);
    });

    loadStatsData();

    return {
        districts,
        dsDivisions,
        selectedDistricts,
        selectedFilters,
        showBeneficiaries,
        showBoundaries,
        isStatsLoading,
        statsFor,
        statsForMultiple,
        currentStats,
        dsdChartData,
    };
}
