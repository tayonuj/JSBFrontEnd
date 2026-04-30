import { ref, watch } from "vue";

export function useCP4Map(props: any, currentDistrict: any) {
    const BENEFICIARY_WFS_URL =
        "https://geoserver.gsentry.cloud/geoserver/UNDP/wfs";
    const BOUNDARY_WFS_URL =
        "https://geoserver.gsentry.cloud/geoserver/AdminBoundary/wfs";
    const BENEFICIARY_LAYER_NAME = "UNDP:JSB4";
    const DEFAULT_MAP_BOUNDS: [[number, number], [number, number]] = [
        [7.083993, 80.205792],
        [9.605331, 80.8349444],
    ];

    const DISTRICT_KEYS = ["District", "district", "DISTRICT"];
    const DSD_KEYS = ["DSD", "dsd", "Dsd"];
    const PROJECT_INPUT_VALUES: Record<string, string[]> = {
        poultry: ["Poultry"],
        poultry_insectproofnet: ["Poultry and Insectproofnet"],
        cookstove: ["Cookstove"],
        solar: ["Solar"],
        cookstove_insectproofnet: ["Cookstove and Insectproofnet"],
        insectproofnet: ["Insectproofnet"],
    };
    const PROJECT_INPUT_POINT_COLORS: Record<string, string> = {
        poultry: "#2f77e2",
        poultry_insectproofnet: "#35c78a",
        cookstove: "#ffb547",
        solar: "#8b5cf6",
        cookstove_insectproofnet: "#f06292",
        insectproofnet: "#22c7d6",
    };
    const GENDER_VALUES: Record<string, string[]> = {
        male: ["Male"],
        female: ["Female"],
    };
    const SYSTEM_HP_VALUES: Record<string, string[]> = {
        "1hp": ["1Hp", "1HP"],
        "2hp": ["2Hp"],
    };

    let map: any = null;
    let districtBoundaryLayer: any = null;
    let dsdBoundaryLayer: any = null;
    let beneficiaryClusterGroup: any = null;

    let boundaryRequestId = 0;
    let beneficiaryRequestId = 0;
    let isPopupOpen = false;
    let updateTimer: number | null = null;

    let boundaryAbortController: AbortController | null = null;
    let beneficiaryAbortController: AbortController | null = null;

    let lastBoundaryKey = "";
    let lastBoundaryZoomGroup = "";

    let lastBeneficiaryGeojson: any = null;
    let lastBeneficiaryBounds: any = null;
    let lastBeneficiaryFetchKey = "";

    const geoJsonCache = new Map<
        string,
        {
            timestamp: number;
            data: any;
        }
    >();

    const CACHE_TTL = 1000 * 60 * 10;

    const loadingProgress = ref(0);
    const isLoading = ref(false);

    const startLoading = (): number | null => {
        if (isLoading.value) return null;

        isLoading.value = true;
        loadingProgress.value = 10;

        const interval = window.setInterval(() => {
            if (loadingProgress.value < 90) {
                loadingProgress.value += 10;
            }
        }, 200);

        return interval;
    };

    const stopLoading = (interval: number | null) => {
        if (interval !== null) {
            window.clearInterval(interval);
        }

        loadingProgress.value = 100;

        window.setTimeout(() => {
            loadingProgress.value = 0;
            isLoading.value = false;
        }, 500);
    };

    const escapeCqlValue = (value: string) => String(value).replace(/'/g, "''");
    const normalizeName = (value: any) => String(value ?? "").trim().toLowerCase();

    const getPropertyValue = (properties: any, keys: string[]) => {
        for (const key of keys) {
            const value = properties?.[key];

            if (value !== null && value !== undefined && String(value).trim() !== "") {
                return String(value).trim();
            }
        }

        return "";
    };

    const getSelectedDistrictNames = (): string[] => {
        const ids: string[] = props.selectedDistricts || [];
        const all: any[] = props.districts || [];

        if (!ids.length) return [];

        return ids
            .map((id) => all.find((district) => district.id === id))
            .filter(Boolean)
            .map((district: any) => district.name);
    };

    const buildDistrictCql = (selectedDistrictNames: string[]) => {
        if (selectedDistrictNames.length === 1) {
            return `District = '${escapeCqlValue(selectedDistrictNames[0])}'`;
        }

        if (selectedDistrictNames.length > 1) {
            return `District IN (${selectedDistrictNames
                .map((name) => `'${escapeCqlValue(name)}'`)
                .join(",")})`;
        }

        return "";
    };

    const getSelectedProjectInputValues = () =>
        PROJECT_INPUT_VALUES[props.selectedProjectInput] || [];

    const getSelectedGenderValues = () => GENDER_VALUES[props.selectedGender] || [];

    const shouldApplySystemHpFilter = (selectedDistrictNames: string[]) =>
        selectedDistrictNames.length === 1 &&
        normalizeName(selectedDistrictNames[0]) === "kilinochchi" &&
        props.selectedProjectInput === "solar" &&
        props.selectedSystemHp !== "all";

    const getSelectedSystemHpValues = (selectedDistrictNames: string[]) =>
        shouldApplySystemHpFilter(selectedDistrictNames)
            ? SYSTEM_HP_VALUES[props.selectedSystemHp] || []
            : [];

    const getProjectInputIdForFeature = (projectInput: unknown) => {
        const normalizedInput = normalizeName(projectInput);

        return (
            Object.entries(PROJECT_INPUT_VALUES).find(([, values]) =>
                values.some((value) => normalizeName(value) === normalizedInput)
            )?.[0] || "default"
        );
    };

    const getPointColor = (properties: Record<string, any>) => {
        const projectInputId = getProjectInputIdForFeature(properties?.ProjectInp);
        return PROJECT_INPUT_POINT_COLORS[projectInputId] || "#16a34a";
    };

    const buildBeneficiaryCql = (selectedDistrictNames: string[]) => {
        const cqlParts: string[] = [];
        const projectInputValues = getSelectedProjectInputValues();
        const genderValues = getSelectedGenderValues();
        const systemHpValues = getSelectedSystemHpValues(selectedDistrictNames);

        if (projectInputValues.length === 1) {
            cqlParts.push(`"ProjectInp" = '${escapeCqlValue(projectInputValues[0])}'`);
        }

        if (genderValues.length === 1) {
            cqlParts.push(`"Gender" = '${escapeCqlValue(genderValues[0])}'`);
        }

        if (systemHpValues.length === 1) {
            cqlParts.push(`"System(HP)" IN (${systemHpValues
                .map((value) => `'${escapeCqlValue(value)}'`)
                .join(",")})`);
        } else if (systemHpValues.length > 1) {
            cqlParts.push(`"System(HP)" IN (${systemHpValues
                .map((value) => `'${escapeCqlValue(value)}'`)
                .join(",")})`);
        }

        return cqlParts.join(" AND ");
    };

    const matchesBeneficiaryFilters = (
        properties: Record<string, any>,
        selectedDistrictNames: string[]
    ) => {
        const districtName = getPropertyValue(properties, DISTRICT_KEYS);

        if (
            selectedDistrictNames.length &&
            !selectedDistrictNames
                .map((name) => normalizeName(name))
                .includes(normalizeName(districtName))
        ) {
            return false;
        }

        const projectInputValues = getSelectedProjectInputValues();
        if (
            projectInputValues.length &&
            !projectInputValues.some(
                (value) => normalizeName(properties?.ProjectInp) === normalizeName(value)
            )
        ) {
            return false;
        }

        const genderValues = getSelectedGenderValues();
        if (
            genderValues.length &&
            !genderValues.some(
                (value) => normalizeName(properties?.Gender) === normalizeName(value)
            )
        ) {
            return false;
        }

        const systemHpValues = getSelectedSystemHpValues(selectedDistrictNames);
        if (
            systemHpValues.length &&
            !systemHpValues.some(
                (value) =>
                    normalizeName(properties?.["System(HP)"]) === normalizeName(value)
            )
        ) {
            return false;
        }

        return true;
    };

    const buildCombinedCql = (filters: string[]) => {
        const cleanFilters = filters.filter(Boolean);
        return cleanFilters.join(" AND ");
    };

    const buildWfsUrl = (
        baseUrl: string,
        typeName: string,
        extraParams: Record<string, string | undefined>
    ) => {
        const params = new URLSearchParams({
            service: "WFS",
            version: "1.1.0",
            request: "GetFeature",
            typeName,
            outputFormat: "application/json",
            srsName: "EPSG:4326",
        });

        Object.entries(extraParams).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.set(key, value);
            }
        });

        return `${baseUrl}?${params.toString()}`;
    };

    const fetchGeoJsonWithCache = async (
        url: string,
        label: string,
        signal?: AbortSignal
    ) => {
        const cached = geoJsonCache.get(url);
        const now = Date.now();

        if (cached && now - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }

        const response = await fetch(url, { signal });
        const text = await response.text();

        if (!response.ok) {
            console.error(`${label} request failed`, response.status, response.statusText);
            console.error(text);
            return null;
        }

        if (text.trim().startsWith("<")) {
            console.error(`${label} returned XML instead of GeoJSON`);
            console.error(text);
            return null;
        }

        try {
            const data = JSON.parse(text);

            geoJsonCache.set(url, {
                timestamp: now,
                data,
            });

            return data;
        } catch (error) {
            console.error(`${label} JSON parse failed`, error);
            console.error(text);
            return null;
        }
    };

    const removeBoundaryLayers = () => {
        if (!map) return;

        if (districtBoundaryLayer && map.hasLayer(districtBoundaryLayer)) {
            map.removeLayer(districtBoundaryLayer);
        }

        if (dsdBoundaryLayer && map.hasLayer(dsdBoundaryLayer)) {
            map.removeLayer(dsdBoundaryLayer);
        }

        districtBoundaryLayer = null;
        dsdBoundaryLayer = null;
    };

    const clearBeneficiaryCluster = () => {
        if (!beneficiaryClusterGroup || !map) return;

        beneficiaryClusterGroup.clearLayers();

        if (map.hasLayer(beneficiaryClusterGroup)) {
            map.removeLayer(beneficiaryClusterGroup);
        }
    };

    const getZoomGroup = (zoom: number) => {
        return zoom >= 9 ? "with-dsd" : "district-only";
    };

    const getBlueShade = (count: number, maxCount: number) => {
        if (!count || maxCount <= 0) return "#eff6ff";

        const ratio = count / maxCount;

        if (ratio >= 0.85) return "#1d4ed8";
        if (ratio >= 0.65) return "#2563eb";
        if (ratio >= 0.45) return "#3b82f6";
        if (ratio >= 0.25) return "#60a5fa";
        if (ratio >= 0.1) return "#93c5fd";

        return "#bfdbfe";
    };

    const getBlueOpacity = (count: number, maxCount: number) => {
        if (!count || maxCount <= 0) return 0.08;

        const ratio = count / maxCount;
        return Math.min(0.75, 0.18 + ratio * 0.5);
    };

    const loadBeneficiaryCounts = async (
        selectedDistrictNames: string[],
        beneficiaryCql: string,
        signal?: AbortSignal
    ) => {
        const districtCounts = new Map<string, number>();
        const dsdCounts = new Map<string, number>();
        const districtCql = buildDistrictCql(selectedDistrictNames);
        const combinedCql = buildCombinedCql([districtCql, beneficiaryCql]);

        const propertyNames = Array.from(
            new Set([...DISTRICT_KEYS, ...DSD_KEYS])
        ).join(",");

        const url = buildWfsUrl(BENEFICIARY_WFS_URL, BENEFICIARY_LAYER_NAME, {
            CQL_FILTER: combinedCql,
            propertyName: propertyNames,
        });

        const geojson = await fetchGeoJsonWithCache(
            url,
            "CP4 beneficiary count WFS",
            signal
        );

        if (!geojson?.features?.length) {
            return {
                districtCounts,
                dsdCounts,
                maxDistrictCount: 0,
                maxDsdCount: 0,
            };
        }

        for (const feature of geojson.features) {
            const properties = feature?.properties || {};
            const districtName = getPropertyValue(properties, DISTRICT_KEYS);
            const normalizedDistrict = normalizeName(districtName);

            if (normalizedDistrict) {
                districtCounts.set(
                    normalizedDistrict,
                    (districtCounts.get(normalizedDistrict) || 0) + 1
                );
            }

            const dsdName = getPropertyValue(properties, DSD_KEYS);
            const normalizedDsd = normalizeName(dsdName);

            if (normalizedDsd) {
                dsdCounts.set(normalizedDsd, (dsdCounts.get(normalizedDsd) || 0) + 1);
            }
        }

        const districtValues = Array.from(districtCounts.values());
        const dsdValues = Array.from(dsdCounts.values());

        return {
            districtCounts,
            dsdCounts,
            maxDistrictCount: districtValues.length ? Math.max(...districtValues) : 0,
            maxDsdCount: dsdValues.length ? Math.max(...dsdValues) : 0,
        };
    };

    const loadBoundaryLayers = async (
        selectedDistrictNames: string[],
        zoom: number,
        beneficiaryCql: string,
        force = false
    ) => {
        const L = (window as any).L;
        if (!map || !L) return;

        const districtCql = buildDistrictCql(selectedDistrictNames);
        const zoomGroup = getZoomGroup(zoom);
        const boundaryKey = `${districtCql || "all"}|${beneficiaryCql || "all"}|${zoomGroup}`;

        if (
            !force &&
            boundaryKey === lastBoundaryKey &&
            zoomGroup === lastBoundaryZoomGroup
        ) {
            return;
        }

        lastBoundaryKey = boundaryKey;
        lastBoundaryZoomGroup = zoomGroup;

        const requestId = ++boundaryRequestId;

        if (boundaryAbortController) {
            boundaryAbortController.abort();
        }

        boundaryAbortController = new AbortController();

        removeBoundaryLayers();

        try {
            const countSummary = await loadBeneficiaryCounts(
                selectedDistrictNames,
                beneficiaryCql,
                boundaryAbortController.signal
            );

            if (requestId !== boundaryRequestId) return;

            const districtUrl = buildWfsUrl(
                BOUNDARY_WFS_URL,
                "AdminBoundary:Districts",
                {
                    CQL_FILTER: districtCql,
                }
            );

            const districtGeojson = await fetchGeoJsonWithCache(
                districtUrl,
                "CP4 district boundary WFS",
                boundaryAbortController.signal
            );

            if (!districtGeojson || requestId !== boundaryRequestId) return;

            districtBoundaryLayer = L.geoJSON(districtGeojson, {
                pane: "boundaryPane",
                interactive: false,
                style: (feature: any) => {
                    const districtName = getPropertyValue(
                        feature?.properties || {},
                        DISTRICT_KEYS
                    );

                    const count =
                        countSummary.districtCounts.get(normalizeName(districtName)) || 0;

                    const showDistrictFill = zoom < 9;

                    return {
                        color: "#000000",
                        weight: showDistrictFill ? 0.8 : 0.6,
                        opacity: 1,
                        fill: true,
                        fillColor: showDistrictFill
                            ? getBlueShade(count, countSummary.maxDistrictCount)
                            : "#ffffff",
                        fillOpacity: showDistrictFill
                            ? getBlueOpacity(count, countSummary.maxDistrictCount)
                            : 0,
                        dashArray: "5 4",
                    };
                },
            });

            districtBoundaryLayer.addTo(map);

            if (zoom >= 9) {
                const dsdUrl = buildWfsUrl(BOUNDARY_WFS_URL, "AdminBoundary:DSD", {
                    CQL_FILTER: districtCql,
                });

                const dsdGeojson = await fetchGeoJsonWithCache(
                    dsdUrl,
                    "CP4 DSD boundary WFS",
                    boundaryAbortController.signal
                );

                if (!dsdGeojson || requestId !== boundaryRequestId) return;

                dsdBoundaryLayer = L.geoJSON(dsdGeojson, {
                    pane: "boundaryPane",
                    interactive: false,
                    style: (feature: any) => {
                        const dsdName = getPropertyValue(
                            feature?.properties || {},
                            DSD_KEYS
                        );

                        const count =
                            countSummary.dsdCounts.get(normalizeName(dsdName)) || 0;

                        return {
                            color: "#000000",
                            weight: 0.4,
                            opacity: 1,
                            fill: true,
                            fillColor: getBlueShade(count, countSummary.maxDsdCount),
                            fillOpacity: getBlueOpacity(count, countSummary.maxDsdCount),
                            dashArray: "3 3",
                        };
                    },
                });

                dsdBoundaryLayer.addTo(map);
            }
        } catch (error: any) {
            if (error?.name === "AbortError") return;
            console.error("Error loading CP4 boundary WFS", error);
        }
    };

    const buildPopupHtml = (properties: Record<string, any>) => {
        const sections = [
            {
                title: "Beneficiary Details",
                fields: [
                    { key: "No", label: "Record No." },
                    { key: "Beneficiar", label: "Beneficiary" },
                    { key: "Gender", label: "Gender" },
                    { key: "Age", label: "Age" },
                    { key: "NIC", label: "NIC" },
                    { key: "Phone_n", label: "Phone" },
                    { key: "WhatsApp", label: "WhatsApp" },
                    { key: "Address", label: "Address" },
                ],
            },
            {
                title: "Location",
                fields: [
                    { key: "District", label: "District" },
                    { key: "DSD", label: "DS Division" },
                    { key: "GND", label: "GN Division" },
                    { key: "Latitude", label: "Latitude" },
                    { key: "Longitude", label: "Longitude" },
                ],
            },
            {
                title: "Household and Livelihood",
                fields: [
                    { key: "BusinesTyp", label: "Business Type" },
                    { key: "FamilyMemb", label: "Family Members" },
                    { key: "LandOwn", label: "Land Ownership" },
                    { key: "IncomeSour", label: "Income Source" },
                    { key: "Income", label: "Income" },
                    { key: "Income Sep", label: "Separate Income" },
                    { key: "ContFarmin", label: "Continuous Farming" },
                    { key: "CurAgriLan", label: "Current Agricultural Land" },
                    { key: "Estate wor", label: "Estate Worker" },
                ],
            },
            {
                title: "Energy and Infrastructure",
                fields: [
                    { key: "Capacity", label: "Electricity Capacity" },
                    { key: "Electricit", label: "Electricity Available" },
                    { key: "CEB Accoun", label: "CEB Account" },
                    { key: "Current En", label: "Current Energy Source" },
                    { key: "Monthly \nA", label: "Monthly Electricity Usage/Amount" },
                    { key: "Roof Type", label: "Roof Type" },
                    { key: "Roof Condi", label: "Roof Condition" },
                    { key: "Coockstove", label: "Cookstove Available" },
                    { key: "cookstove", label: "Cookstove Project Flag" },
                    { key: "insectproo", label: "Insect Proofing" },
                    { key: "Polurity", label: "Poultry" },
                    { key: "Rooftopsol", label: "Rooftop Solar" },
                    { key: "Type of So", label: "Type of Solution" },
                    { key: "Status o_1", label: "Solution Status" },
                    { key: "Opportnuti", label: "Opportunity" },
                    { key: "Energy", label: "Energy" },
                    { key: "E_Unit", label: "Energy Unit" },
                    { key: "Monthly Ex", label: "Monthly Expenditure" },
                    { key: "Solar Pane", label: "Solar Panel" },
                    { key: "System(HP)", label: "System (HP)" },
                ],
            },
            {
                title: "Project Details",
                fields: [
                    { key: "ProjectInp", label: "Project Input" },
                    { key: "NICPropose", label: "NIC Proposed Beneficiary" },
                    { key: "Age Propos", label: "Age of Proposed Beneficiary" },
                    { key: "Available", label: "Available Project Area" },
                    { key: "Number of", label: "Number Of" },
                    { key: "Availabl_1", label: "Available Capacity" },
                    { key: "Space avai", label: "Space Available" },
                    { key: "Individual", label: "Individual Space Type" },
                    { key: "Status of", label: "Project Status" },
                    { key: "Remark", label: "Remark" },
                    { key: "Cluster Ag", label: "Cluster / Aggregation" },
                    { key: "Recommend", label: "Recommendation" },
                    { key: "Criteria 1", label: "Criteria 1" },
                    { key: "Criteria", label: "Criteria 2" },
                    { key: "Criteria_1", label: "Criteria 3" },
                    { key: "Criteria_2", label: "Criteria 4" },
                    { key: "Total", label: "Total Score" },
                    { key: "Rank", label: "Rank" },
                ],
            },
        ];

        const hasValue = (value: unknown) =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== "";

        const renderValue = (value: unknown) => String(value).replace(/\n/g, "<br/>");

        let html =
            `<div style="font-size:13px; line-height:1.45; max-height:320px; overflow:auto; min-width:260px;">`;

        sections.forEach((section) => {
            const rows = section.fields
                .filter(({ key }) => hasValue(properties[key]))
                .map(
                    ({ key, label }) =>
                        `<div style="margin:0 0 6px;"><strong>${label}:</strong> ${renderValue(properties[key])}</div>`
                );

            if (!rows.length) return;

            html += `
                <div style="margin:0 0 12px;">
                    <div style="font-weight:700; color:#1e3a8a; margin:0 0 6px; padding-bottom:4px; border-bottom:1px solid #dbeafe;">
                        ${section.title}
                    </div>
                    ${rows.join("")}
                </div>
            `;
        });

        html += `</div>`;
        return html;
    };

    const renderBeneficiaryPoints = (
        geojson: any,
        selectedDistrictNames: string[]
    ) => {
        const L = (window as any).L;
        if (!map || !L || !beneficiaryClusterGroup) return;

        clearBeneficiaryCluster();

        const pointLayer = L.geoJSON(geojson, {
            filter: (feature: any) => {
                const properties = feature?.properties || {};
                return matchesBeneficiaryFilters(properties, selectedDistrictNames);
            },
            pointToLayer: (_feature: any, latlng: any) =>
                L.circleMarker(latlng, {
                    radius: 3.4,
                    weight: 0.8,
                    color: "#ffffff",
                    fillColor: getPointColor(_feature?.properties || {}),
                    fillOpacity: 0.9,
                }),
            onEachFeature: (feature: any, layer: any) => {
                const properties = feature.properties || {};

                layer.bindPopup(buildPopupHtml(properties), {
                    maxWidth: 340,
                    autoPan: true,
                    keepInView: true,
                });
            },
        });

        beneficiaryClusterGroup.addLayer(pointLayer);

        if (!map.hasLayer(beneficiaryClusterGroup)) {
            map.addLayer(beneficiaryClusterGroup);
        }
    };

    const loadBeneficiaryPoints = async (
        selectedDistrictNames: string[]
    ) => {
        if (!map || !beneficiaryClusterGroup) return;

        const requestId = ++beneficiaryRequestId;
        const bounds = map.getBounds();

        if (
            lastBeneficiaryGeojson &&
            lastBeneficiaryBounds &&
            lastBeneficiaryBounds.contains(bounds)
        ) {
            renderBeneficiaryPoints(lastBeneficiaryGeojson, selectedDistrictNames);
            return;
        }

        if (beneficiaryAbortController) {
            beneficiaryAbortController.abort();
        }

        beneficiaryAbortController = new AbortController();

        clearBeneficiaryCluster();

        const paddedBounds = bounds.pad(0.35);
        const bbox = [
            paddedBounds.getWest(),
            paddedBounds.getSouth(),
            paddedBounds.getEast(),
            paddedBounds.getNorth(),
            "EPSG:4326",
        ].join(",");

        const fetchKey = bbox;

        if (lastBeneficiaryGeojson && lastBeneficiaryFetchKey === fetchKey) {
            renderBeneficiaryPoints(lastBeneficiaryGeojson, selectedDistrictNames);
            return;
        }

        const url = buildWfsUrl(BENEFICIARY_WFS_URL, BENEFICIARY_LAYER_NAME, {
            BBOX: bbox,
        });

        const interval = startLoading();

        try {
            const geojson = await fetchGeoJsonWithCache(
                url,
                "CP4 beneficiary WFS",
                beneficiaryAbortController.signal
            );

            if (!geojson || requestId !== beneficiaryRequestId) {
                stopLoading(interval);
                return;
            }

            lastBeneficiaryGeojson = geojson;
            lastBeneficiaryBounds = paddedBounds;
            lastBeneficiaryFetchKey = fetchKey;

            renderBeneficiaryPoints(geojson, selectedDistrictNames);
            stopLoading(interval);
        } catch (error: any) {
            if (error?.name === "AbortError") {
                stopLoading(interval);
                return;
            }

            console.error("Error loading CP4 beneficiary WFS", error);
            stopLoading(interval);
        }
    };

    const refreshSize = () => {
        if (!map) return;

        window.setTimeout(() => {
            map.invalidateSize();
        }, 50);
    };

    const scheduleUpdateLayers = () => {
        if (isPopupOpen) return;

        if (updateTimer !== null) {
            window.clearTimeout(updateTimer);
        }

        updateTimer = window.setTimeout(() => {
            if (!isPopupOpen) {
                updateLayers();
            }
        }, 500);
    };

    const fitToSelectedDistricts = () => {
        const L = (window as any).L;
        if (!map || !L) return;

        const selectedIds = props.selectedDistricts || [];
        const targetDistricts = selectedIds.length
            ? (props.districts || []).filter((district: any) =>
                  selectedIds.includes(district.id)
              )
            : props.districts || [];

        if (!targetDistricts.length) {
            map.fitBounds(DEFAULT_MAP_BOUNDS, { padding: [20, 20] });
            return;
        }

        if (targetDistricts.length === 1) {
            const district = targetDistricts[0];
            map.setView([district.lat, district.lng], Math.max(map.getZoom() || 7, 9));
            return;
        }

        const bounds = L.latLngBounds(
            targetDistricts.map((district: any) => [district.lat, district.lng])
        );
        map.fitBounds(bounds.pad(1.2), { padding: [20, 20] });
    };

    const initMap = () => {
        const L = (window as any).L;
        if (!L || map) return;

        map = L.map("cp4-map", {
            center: [
                currentDistrict.value?.lat || 7.121331,
                currentDistrict.value?.lng || 80.749128,
            ],
            zoom: 8,
            minZoom: 6,
            maxZoom: 14,
        });

        const LAny = L as any;

        if (LAny.Control && LAny.Control.FullScreen) {
            map.addControl(new LAny.Control.FullScreen({ position: "topleft" }));
        }

        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
            {
                attribution: "Tiles &copy; Esri",
                maxZoom: 13,
            }
        ).addTo(map);

        if (!map.getPane("boundaryPane")) {
            map.createPane("boundaryPane");
            map.getPane("boundaryPane").style.zIndex = "450";
            map.getPane("boundaryPane").style.pointerEvents = "none";
        }

        if (LAny.markerClusterGroup) {
            beneficiaryClusterGroup = LAny.markerClusterGroup({
                disableClusteringAtZoom: 13,
                spiderfyOnEveryZoom: false,
                showCoverageOnHover: false,
                maxClusterRadius: 50,
                chunkedLoading: true,
                chunkInterval: 150,
                chunkDelay: 30,
                iconCreateFunction: (cluster: any) => {
                    const count = cluster.getChildCount();

                    let sizeClass = "sm";
                    if (count >= 100) sizeClass = "lg";
                    else if (count >= 25) sizeClass = "md";

                    return L.divIcon({
                        html: `<span>${count}</span>`,
                        className: `fp1-cluster fp1-cluster--${sizeClass}`,
                        iconSize: [34, 34],
                    });
                },
            });
        } else {
            beneficiaryClusterGroup = L.layerGroup();
        }

        map.on("zoomend", scheduleUpdateLayers);
        map.on("moveend", scheduleUpdateLayers);

        map.on("popupopen", () => {
            isPopupOpen = true;

            if (updateTimer !== null) {
                window.clearTimeout(updateTimer);
                updateTimer = null;
            }
        });

        map.on("popupclose", () => {
            isPopupOpen = false;
        });

        fitToSelectedDistricts();

        updateLayers(true);
    };

    const recenterOnDistricts = () => {
        if (!map) return;

        lastBeneficiaryGeojson = null;
        lastBeneficiaryBounds = null;
        lastBeneficiaryFetchKey = "";

        fitToSelectedDistricts();
    };

    const updateLayers = async (forceBoundaryReload = true) => {
        const L = (window as any).L;
        if (!map || !L) return;

        const zoom = map.getZoom() || 7;
        const selectedDistrictNames = getSelectedDistrictNames();
        const beneficiaryCql = buildBeneficiaryCql(selectedDistrictNames);

        if (props.showBoundaries) {
            await loadBoundaryLayers(
                selectedDistrictNames,
                zoom,
                beneficiaryCql,
                forceBoundaryReload
            );
        } else {
            boundaryRequestId++;
            lastBoundaryKey = "";
            lastBoundaryZoomGroup = "";
            removeBoundaryLayers();
        }

        if (!props.showBeneficiaries) {
            beneficiaryRequestId++;
            clearBeneficiaryCluster();
            return;
        }

        await loadBeneficiaryPoints(selectedDistrictNames);
    };

    watch(
        () => [
            props.selectedDistricts,
            props.selectedProjectInput,
            props.selectedGender,
            props.selectedSystemHp,
            props.showBeneficiaries,
            props.showBoundaries,
        ],
        () => {
            updateLayers();
        },
        { deep: true }
    );

    return {
        initMap,
        updateLayers,
        recenterOnDistricts,
        loadingProgress,
        isLoading,
        refreshSize,
    };
}
