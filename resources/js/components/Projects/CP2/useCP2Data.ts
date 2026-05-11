import { computed, ref } from "vue";

type Stat = {
    beneficiaries: number;
    totalCount: number;
    maleCount: number;
    femaleCount: number;
    youthCount: number;
    supportValue: number;
};

type Option = {
    id: string;
    label: string;
};

type District = {
    id: string;
    name: string;
    lat: number;
    lng: number;
};

type CP2Row = {
    districtId: string;
    districtName: string;
    dsdName: string;
    technologyId: string;
    technologyLabel: string;
    maleCount: number;
    femaleCount: number;
    youthCount: number;
    totalCount: number;
    lat: number | null;
    lng: number | null;
};

const BENEFICIARY_WFS_URL =
    "https://geoserver.gsentry.cloud/geoserver/UNDP/wfs";
const BENEFICIARY_LAYER_NAME = "UNDP:JSB2";

const DISTRICT_LABEL_ALIASES: Record<string, string> = {
    batticoloa: "Batticaloa",
    batticaloa: "Batticaloa",
    kurunegala: "Kurunegala",
};

const DEFAULT_DISTRICTS: District[] = [
    { id: "ampara", name: "Ampara", lat: 7.2917, lng: 81.6724 },
    { id: "batticaloa", name: "Batticaloa", lat: 7.717, lng: 81.7007 },
    { id: "kurunegala", name: "Kurunegala", lat: 7.4863, lng: 80.3647 },
    { id: "puttalam", name: "Puttalam", lat: 8.0362, lng: 79.8283 },
    { id: "trincomalee", name: "Trincomalee", lat: 8.5874, lng: 81.2152 },
];

const DEFAULT_TECHNOLOGY_OPTIONS: Option[] = [
    {
        id: "solar-powered-water-pumping-system-for-cultivation-lands-large-25kw-up-to-1000000ltrsday",
        label: "Solar powered water pumping system for Cultivation Lands(Large,25kW/Up to 1,000,000ltrs/day)",
    },
    {
        id: "portable-solar-powered-pump-for-cultivation-lands-small-5200-ltresday",
        label: "Portable solar powered pump for cultivation lands(Small-5200 Ltres/day)",
    },
    {
        id: "portable-solar-powered-water-pump-for-cultivation-lands-small-5200-ltresday",
        label: "Portable solar powered water pump for cultivation lands(Small-5200 Ltres/day)",
    },
    {
        id: "solar-powered-backpack-sprayer-16-itrs",
        label: "Solar Powered Backpack Sprayer (16 Itrs)",
    },
    {
        id: "solar-powered-moth-rellellents",
        label: "Solar Powered Moth Rellellents",
    },
    {
        id: "development-farmer-training-facility-with-solar-pv",
        label: "Development Farmer Training Facility with Solar PV",
    },
    {
        id: "grid-tied-solar-power-system-for-existing-small-scale-milk-chilling-centers-4kw",
        label: "Grid Tied Solar Power System for Existing Small Scale Milk Chilling Centers (4kW)",
    },
    {
        id: "grid-tied-solar-powered-containerized-cold-rooms-40c-5000-kg",
        label: "Grid Tied Solar Powered Containerized Cold Rooms (40C, 5000 kg)",
    },
    {
        id: "solar-powered-milk-can-cooler-40-ltrs-x-8-can",
        label: "Solar Powered Milk Can Cooler (40 Ltrs x 8 can)",
    },
];

const normalizeText = (value: unknown) =>
    String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");

const slugify = (value: string) =>
    normalizeText(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const parseNumber = (value: unknown) => {
    const normalized = String(value ?? "").replace(/,/g, "").trim();
    if (!normalized) return 0;

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
};

const canonicalDistrictName = (value: unknown) => {
    const normalized = normalizeText(value);
    const alias = DISTRICT_LABEL_ALIASES[normalized.toLowerCase()];

    return alias || normalized;
};

const districtIdFromName = (value: unknown) => slugify(canonicalDistrictName(value));

const technologyLabelFromValue = (value: unknown) => normalizeText(value);
const technologyIdFromValue = (value: unknown) => slugify(technologyLabelFromValue(value));

const getGeoJsonRows = async (): Promise<CP2Row[]> => {
    const params = new URLSearchParams({
        service: "WFS",
        version: "1.1.0",
        request: "GetFeature",
        typeName: BENEFICIARY_LAYER_NAME,
        outputFormat: "application/json",
        srsName: "EPSG:4326",
    });

    const response = await fetch(`${BENEFICIARY_WFS_URL}?${params.toString()}`);
    const text = await response.text();

    if (!response.ok) {
        throw new Error(`CP2 WFS request failed: ${response.status} ${response.statusText}`);
    }

    const geojson = JSON.parse(text);
    const features = Array.isArray(geojson?.features) ? geojson.features : [];

    return features.map((feature: any) => {
        const properties = feature?.properties || {};

        return {
            districtId: districtIdFromName(properties?.District),
            districtName: canonicalDistrictName(properties?.District),
            dsdName: normalizeText(properties?.DSD),
            technologyId: technologyIdFromValue(
                properties?.ProjectInp || properties?.Technology
            ),
            technologyLabel: technologyLabelFromValue(
                properties?.ProjectInp || properties?.Technology
            ),
            maleCount: parseNumber(properties?.Male),
            femaleCount: parseNumber(properties?.Female),
            youthCount: parseNumber(properties?.Youth),
            totalCount: parseNumber(properties?.Total),
            lat: Number.isFinite(parseNumber(properties?.Lat))
                ? parseNumber(properties?.Lat)
                : null,
            lng: Number.isFinite(parseNumber(properties?.lng))
                ? parseNumber(properties?.lng)
                : null,
        };
    });
};

const districts = ref<District[]>(DEFAULT_DISTRICTS);
const projectInputOptions = ref<Option[]>(DEFAULT_TECHNOLOGY_OPTIONS);
const dataRows = ref<CP2Row[]>([]);
const hasLoadedGeoServerData = ref(false);

let loadPromise: Promise<void> | null = null;

const loadGeoServerData = async () => {
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        try {
            const rows = await getGeoJsonRows();
            dataRows.value = rows;

            const districtBuckets = new Map<
                string,
                { name: string; latTotal: number; lngTotal: number; pointCount: number }
            >();
            const technologyBuckets = new Map<string, string>();

            rows.forEach((row) => {
                if (row.districtId && row.districtName) {
                    const bucket = districtBuckets.get(row.districtId) || {
                        name: row.districtName,
                        latTotal: 0,
                        lngTotal: 0,
                        pointCount: 0,
                    };

                    if (row.lat !== null && row.lng !== null) {
                        bucket.latTotal += row.lat;
                        bucket.lngTotal += row.lng;
                        bucket.pointCount += 1;
                    }

                    districtBuckets.set(row.districtId, bucket);
                }

                if (row.technologyId && row.technologyLabel) {
                    technologyBuckets.set(row.technologyId, row.technologyLabel);
                }
            });

            const derivedDistricts = Array.from(districtBuckets.entries())
                .map(([id, bucket]) => ({
                    id,
                    name: bucket.name,
                    lat: bucket.pointCount
                        ? +(bucket.latTotal / bucket.pointCount).toFixed(6)
                        : DEFAULT_DISTRICTS.find((district) => district.id === id)?.lat || 7.9,
                    lng: bucket.pointCount
                        ? +(bucket.lngTotal / bucket.pointCount).toFixed(6)
                        : DEFAULT_DISTRICTS.find((district) => district.id === id)?.lng || 80.6,
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            const derivedTechnologies = Array.from(technologyBuckets.entries())
                .map(([id, label]) => ({ id, label }))
                .sort((a, b) => a.label.localeCompare(b.label));

            if (derivedDistricts.length) {
                districts.value = derivedDistricts;
            }

            if (derivedTechnologies.length) {
                projectInputOptions.value = derivedTechnologies;
            }

            hasLoadedGeoServerData.value = true;
        } catch (error) {
            console.error("Failed to load CP2 GeoServer summary data", error);
        }
    })();

    return loadPromise;
};

const genderOptions: Option[] = [
    { id: "all", label: "All" },
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
];

const selectedDistricts = ref<string[]>([]);
const selectedProjectInput = ref<string>("all");
const selectedGender = ref<string>("all");
const selectedSystemHp = ref<string>("all");

const showBeneficiaries = ref(true);
const showBoundaries = ref(true);

const showSystemHpFilter = computed(() => false);
const systemHpOptions: Option[] = [];

const getSelectedBeneficiaryCount = (row: CP2Row, genderId: string) => {
    if (genderId === "male") return row.maleCount;
    if (genderId === "female") return row.femaleCount;
    return row.totalCount;
};

const matchesFilters = (
    row: CP2Row,
    districtId: string,
    projectInputId: string
) => {
    const districtMatches = districtId === "all" || row.districtId === districtId;
    const technologyMatches =
        projectInputId === "all" || row.technologyId === projectInputId;

    return districtMatches && technologyMatches;
};

export function useCP2Data() {
    void loadGeoServerData();

    const statsFor = (
        districtId: string,
        projectInputId = "all",
        genderId = "all"
    ): Stat => {
        return dataRows.value.reduce<Stat>(
            (totals, row) => {
                if (!matchesFilters(row, districtId, projectInputId)) {
                    return totals;
                }

                totals.beneficiaries += getSelectedBeneficiaryCount(row, genderId);
                totals.totalCount += row.totalCount;
                totals.maleCount += row.maleCount;
                totals.femaleCount += row.femaleCount;
                totals.youthCount += row.youthCount;
                totals.supportValue += row.totalCount;

                return totals;
            },
            {
                beneficiaries: 0,
                totalCount: 0,
                maleCount: 0,
                femaleCount: 0,
                youthCount: 0,
                supportValue: 0,
            }
        );
    };

    const statsForMultiple = (
        districtIds: string[],
        projectInputId = "all",
        genderId = "all"
    ): Stat => {
        const ids = districtIds.length
            ? districtIds
            : districts.value.map((district) => district.id);

        return ids.reduce<Stat>(
            (totals, districtId) => {
                const stat = statsFor(districtId, projectInputId, genderId);

                totals.beneficiaries += stat.beneficiaries;
                totals.totalCount += stat.totalCount;
                totals.maleCount += stat.maleCount;
                totals.femaleCount += stat.femaleCount;
                totals.youthCount += stat.youthCount;
                totals.supportValue += stat.supportValue;

                return totals;
            },
            {
                beneficiaries: 0,
                totalCount: 0,
                maleCount: 0,
                femaleCount: 0,
                youthCount: 0,
                supportValue: 0,
            }
        );
    };

    const currentStats = computed<Stat>(() =>
        statsForMultiple(
            selectedDistricts.value,
            selectedProjectInput.value,
            selectedGender.value
        )
    );

    return {
        districts,
        projectInputOptions,
        genderOptions,
        systemHpOptions,
        selectedDistricts,
        selectedProjectInput,
        selectedGender,
        selectedSystemHp,
        showSystemHpFilter,
        showBeneficiaries,
        showBoundaries,
        currentStats,
        statsFor,
        statsForMultiple,
        hasLoadedGeoServerData,
    };
}
