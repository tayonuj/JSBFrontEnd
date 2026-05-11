import { ref } from "vue";

export function useHomeMap(props: any, currentDistrict: any) {
  const BENEFICIARY_WFS_URL = "https://geoserver.gsentry.cloud/geoserver/UNDP/wfs";
  const JSB_ALL_LAYER_NAME = "UNDP:JSBALL";
  const JSB2_LAYER_NAME = "UNDP:JSB2";
  const HOME_BENEFICIARY_TYPE_NAMES = [JSB_ALL_LAYER_NAME, JSB2_LAYER_NAME];
  const BOUNDARY_WFS_URL = "https://geoserver.gsentry.cloud/geoserver/AdminBoundary/wfs";
  const DISTRICT_KEYS = ["District", "district", "DISTRICT"];
  const DSD_KEYS = ["DSD", "dsd", "Dsd"];
  const PROJECT_KEYS = ["ProjectInp", "Project Input", "Technology", "Project"];
  const SOCIETY_KEYS = ["Name of th", "Name of the society"];
  const CONTACT_PERSON_KEYS = ["Contact Pe", "Contact Person"];
  const AI_LDO_KEYS = ["AI /LDO Di", "AI /LDO Division"];
  const PHONE_KEYS = ["Phone Numb", "Phone Number", "Phone_n", "Phone_Num"];
  const BOUNDARY_PANE = "boundaryPane";
  const BENEFICIARY_PANE = "beneficiaryPane";

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

  const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

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

  const escapeCqlValue = (value: string) => {
    return String(value).replace(/'/g, "''");
  };

  const normalizeName = (value: any) => {
    return String(value ?? "").trim().toLowerCase();
  };

  const getProjectFilterKey = (value: unknown) => {
    const normalized = String(value ?? "").trim().toLowerCase();
    const climatePromiseMatch = normalized.match(/^climate\s*promi(?:s|c)e\s*-?\s*(\d+)$/);

    if (climatePromiseMatch) {
      return `climate-promise-${climatePromiseMatch[1]}`;
    }

    return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };

  const formatProjectDisplay = (value: unknown) => {
    const text = String(value ?? "").trim();
    const normalized = text.toLowerCase();

    if (normalized === "foodsecurity" || normalized === "food-security") {
      return "Food Security";
    }

    const climatePromiseMatch = normalized.match(/^climate\s*promi(?:s|c)e\s*-?\s*(\d+)$/);

    if (climatePromiseMatch) {
      return `Climate Promise ${climatePromiseMatch[1]}`;
    }

    return text;
  };

  const foodSecurityBenefitLabels: Record<string, string> = {
    coops: "Coops / Housing",
    chicks: "Chicks",
    feeder_dri: "Feeders & Drinkers",
    trainings: "Trainings",
    maize_cult: "Maize Cultivation"
  };

  const formatFoodSecurityBenefit = (value: unknown) => {
    const text = String(value ?? "").trim();
    const normalized = text.toLowerCase();

    if (!text || normalized === "foodsecurity" || normalized === "food-security") {
      return "";
    }

    const benefits = [
      ["coops", foodSecurityBenefitLabels.coops],
      ["chicks", foodSecurityBenefitLabels.chicks],
      ["feeder", foodSecurityBenefitLabels.feeder_dri],
      ["train", foodSecurityBenefitLabels.trainings],
      ["maize", foodSecurityBenefitLabels.maize_cult]
    ]
        .filter(([token]) => normalized.includes(token))
        .map(([, label]) => label);

    return benefits.length ? benefits.join(", ") : text;
  };

  const isFoodSecurityFeature = (properties: Record<string, any>) =>
    getProjectFilterKey(getHomeProjectValue(properties)) === "foodsecurity";

  const parseNumber = (value: unknown) => {
    const parsed = Number(String(value ?? "").replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getPropertyValue = (properties: any, keys: string[]) => {
    for (const key of keys) {
      const value = properties?.[key];
      if (value !== null && value !== undefined && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return "";
  };

  const getProjectValue = (properties: Record<string, any>) => {
    return getPropertyValue(properties, PROJECT_KEYS);
  };

  const getFeatureSourceLayer = (properties: Record<string, any>) =>
    properties?.__homeLayer || JSB_ALL_LAYER_NAME;

  const getHomeProjectValue = (properties: Record<string, any>) => {
    return getFeatureSourceLayer(properties) === JSB2_LAYER_NAME
      ? "Climate Promise 2"
      : String(properties?.Project ?? "").trim();
  };

  const hasValidCategoryValue = (properties: any, categoryColumn: string | undefined) => {
    if (!categoryColumn) return true;

    return getProjectFilterKey(getHomeProjectValue(properties)) === getProjectFilterKey(categoryColumn);
  };

  const getBeneficiaryTotal = (properties: Record<string, any>) => {
    return getFeatureSourceLayer(properties) === JSB2_LAYER_NAME
      ? parseNumber(properties?.Total)
      : 1;
  };

  const addSourceLayerToGeojson = (geojson: any, typeName: string) => {
    const features = Array.isArray(geojson?.features) ? geojson.features : [];

    return {
      ...geojson,
      features: features.map((feature: any) => ({
        ...feature,
        properties: {
          ...(feature?.properties || {}),
          __homeLayer: typeName
        }
      }))
    };
  };

  const mergeFeatureCollections = (collections: any[]) => ({
    type: "FeatureCollection",
    features: collections.flatMap((collection) =>
      Array.isArray(collection?.features) ? collection.features : []
    )
  });

  const getCountPropertyNames = (typeName: string) => {
    return typeName === JSB2_LAYER_NAME
      ? "District,DSD,Male,Female,Total"
      : "District,DSD,Project";
  };

  const getSelectedDistrictNames = (): string[] => {
    const ids: string[] = props.selectedDistricts || [];
    const all: any[] = props.districts || [];

    if (!ids.length) {
      return [];
    }

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

  const buildBeneficiaryCql = (
      typeName: string,
      selectedDistrictNames: string[],
      categoryColumn: string | undefined
  ) => {
    const cqlParts: string[] = [];
    const districtCql = buildDistrictCql(selectedDistrictNames);

    if (districtCql) {
      cqlParts.push(districtCql);
    }

    if (categoryColumn) {
      if (typeName === JSB2_LAYER_NAME) {
        if (getProjectFilterKey(categoryColumn) !== getProjectFilterKey("Climate Promise 2")) {
          cqlParts.push("1 = 0");
        }
      } else {
        cqlParts.push(`Project = '${escapeCqlValue(categoryColumn)}'`);
      }
    }

    return cqlParts.join(" AND ");
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
      srsName: "EPSG:4326"
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
      console.error(`${label} returned XML instead of GeoJSON:`);
      console.error(text);
      return null;
    }

    try {
      const data = JSON.parse(text);

      geoJsonCache.set(url, {
        timestamp: now,
        data
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
    if (!count || maxCount <= 0) return "#f0fdf4";

    const ratio = count / maxCount;

    if (ratio >= 0.85) return "#14532d";
    if (ratio >= 0.65) return "#166534";
    if (ratio >= 0.45) return "#16a34a";
    if (ratio >= 0.25) return "#4ade80";
    if (ratio >= 0.1) return "#86efac";

    return "#bbf7d0";
  };

  const getBlueOpacity = (count: number, maxCount: number) => {
    if (!count || maxCount <= 0) return 0.08;

    const ratio = count / maxCount;
    return Math.min(0.75, 0.18 + ratio * 0.5);
  };

  const loadBeneficiaryCounts = async (
      selectedDistrictNames: string[],
      categoryColumn: string | undefined,
      signal?: AbortSignal
  ) => {
    const districtCounts = new Map<string, number>();
    const dsdCounts = new Map<string, number>();

    const districtCql = buildDistrictCql(selectedDistrictNames);

    const selectedDistrictSet = new Set(
        selectedDistrictNames.map((name) => normalizeName(name))
    );

    for (const typeName of HOME_BENEFICIARY_TYPE_NAMES) {
      const url = buildWfsUrl(BENEFICIARY_WFS_URL, typeName, {
        CQL_FILTER: districtCql,
        propertyName: getCountPropertyNames(typeName)
      });

      const geojson = await fetchGeoJsonWithCache(
          url,
          `${typeName} beneficiary count WFS`,
          signal
      );

      if (!geojson?.features?.length) {
        continue;
      }

      const taggedGeojson = addSourceLayerToGeojson(geojson, typeName);

      for (const feature of taggedGeojson.features) {
        const properties = feature?.properties || {};

        const districtName = getPropertyValue(properties, DISTRICT_KEYS);
        const normalizedDistrict = normalizeName(districtName);

        if (
            selectedDistrictSet.size > 0 &&
            !selectedDistrictSet.has(normalizedDistrict)
        ) {
          continue;
        }

        if (!hasValidCategoryValue(properties, categoryColumn)) {
          continue;
        }

        if (normalizedDistrict) {
          districtCounts.set(
              normalizedDistrict,
              (districtCounts.get(normalizedDistrict) || 0) + getBeneficiaryTotal(properties)
          );
        }

        const dsdName = getPropertyValue(properties, DSD_KEYS);
        const normalizedDsd = normalizeName(dsdName);

        if (normalizedDsd) {
          dsdCounts.set(
              normalizedDsd,
              (dsdCounts.get(normalizedDsd) || 0) + getBeneficiaryTotal(properties)
          );
        }
      }
    }

    const districtValues = Array.from(districtCounts.values());
    const dsdValues = Array.from(dsdCounts.values());

    return {
      districtCounts,
      dsdCounts,
      maxDistrictCount: districtValues.length ? Math.max(...districtValues) : 0,
      maxDsdCount: dsdValues.length ? Math.max(...dsdValues) : 0
    };
  };

  const loadBoundaryLayers = async (
      selectedDistrictNames: string[],
      zoom: number,
      categoryColumn: string | undefined,
      force = false
  ) => {
    const L = (window as any).L;
    if (!map || !L) return;

    const districtCql = buildDistrictCql(selectedDistrictNames);
    const zoomGroup = getZoomGroup(zoom);
    const boundaryKey = `${districtCql || "all"}|${zoomGroup}|${categoryColumn || "all-beneficiaries"}`;

    // prevent unnecessary reloads
    if (!force && boundaryKey === lastBoundaryKey && zoomGroup === lastBoundaryZoomGroup) {
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
          categoryColumn,
          boundaryAbortController.signal
      );

      if (requestId !== boundaryRequestId) return;

      const districtUrl = buildWfsUrl(
          BOUNDARY_WFS_URL,
          "AdminBoundary:Districts",
          {
            CQL_FILTER: districtCql
          }
      );

      const districtGeojson = await fetchGeoJsonWithCache(
          districtUrl,
          "District boundary WFS",
          boundaryAbortController.signal
      );

      if (!districtGeojson || requestId !== boundaryRequestId) return;

      districtBoundaryLayer = L.geoJSON(districtGeojson, {
        pane: BOUNDARY_PANE,
        interactive: false,
        style: (feature: any) => {
          const districtName = getPropertyValue(feature?.properties || {}, DISTRICT_KEYS);
          const count =
              countSummary.districtCounts.get(normalizeName(districtName)) || 0;

          const showDistrictFill = zoom < 9;

          return {
            color: "#000",
            weight: showDistrictFill ? 0.8 : 0.6,
            opacity: 1,
            fill: true,
            fillColor: showDistrictFill
                ? getBlueShade(count, countSummary.maxDistrictCount)
                : "#ffffff",
            fillOpacity: showDistrictFill
                ? getBlueOpacity(count, countSummary.maxDistrictCount)
                : 0,
            dashArray: "5 4"
          };
        }
      });

      districtBoundaryLayer.addTo(map);

      if (zoom >= 9) {
        const dsdUrl = buildWfsUrl(
            BOUNDARY_WFS_URL,
            "AdminBoundary:DSD",
            {
              CQL_FILTER: districtCql
            }
        );

        const dsdGeojson = await fetchGeoJsonWithCache(
            dsdUrl,
            "DSD boundary WFS",
            boundaryAbortController.signal
        );

        if (!dsdGeojson || requestId !== boundaryRequestId) return;

        dsdBoundaryLayer = L.geoJSON(dsdGeojson, {
          pane: BOUNDARY_PANE,
          interactive: false,
          style: (feature: any) => {
            const dsdName = getPropertyValue(feature?.properties || {}, DSD_KEYS);
            const count =
                countSummary.dsdCounts.get(normalizeName(dsdName)) || 0;

            return {
              color: "#000",
              weight: 0.4,
              opacity: 1,
              fill: true,
              fillColor: getBlueShade(count, countSummary.maxDsdCount),
              fillOpacity: getBlueOpacity(count, countSummary.maxDsdCount),
              dashArray: "3 3"
            };
          }
        });

        dsdBoundaryLayer.addTo(map);
      }
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      console.error("Error loading boundary WFS", error);
    }
  };

  const renderBeneficiaryPoints = (
      geojson: any,
      selectedDistrictNames: string[],
      categoryColumn: string | undefined
  ) => {
    const L = (window as any).L;
    if (!map || !L || !beneficiaryClusterGroup) return;

    clearBeneficiaryCluster();

    const selectedDistrictSet = new Set(
        selectedDistrictNames.map((name) => normalizeName(name))
    );

    const pointLayer = L.geoJSON(geojson, {
      filter: (feature: any) => {
        const properties = feature.properties || {};
        const districtName = getPropertyValue(properties, DISTRICT_KEYS);

        if (
            selectedDistrictSet.size > 0 &&
            !selectedDistrictSet.has(normalizeName(districtName))
        ) {
          return false;
        }

        return hasValidCategoryValue(properties, categoryColumn);
      },

      pointToLayer: (_feature: any, latlng: any) =>
          {
            const project = getHomeProjectValue(_feature?.properties || {});
            const fillColor = props.projectColors?.[project] || "#16a34a";

            return L.circleMarker(latlng, {
              pane: BENEFICIARY_PANE,
              radius: 3.4,
              weight: 0.8,
              color: "#ffffff",
              fillColor,
              fillOpacity: 0.9
            });
          },

      onEachFeature: (feature: any, layer: any) => {
        const properties = feature.properties || {};

        const isJsb2Feature = getFeatureSourceLayer(properties) === JSB2_LAYER_NAME;

        const sections = isJsb2Feature
          ? [
              {
                title: "Project Details",
                fields: [
                  { key: "HomeProject", label: "Project" },
                  { key: "Technology", label: "Benefit Provided" },
                  { key: "Department", label: "Department" },
                ],
              },
              {
                title: "Beneficiary Counts",
                fields: [
                  { key: "Male", label: "Male" },
                  { key: "Female", label: "Female" },
                  { key: "Youth", label: "Youth" },
                  { key: "Total", label: "Total" },
                ],
              },
              {
                title: "Contacts and Location",
                fields: [
                  { key: "Contact Pe", label: "Contact Person" },
                  { key: "Name of th", label: "Name of the Society" },
                  { key: "Location", label: "Location" },
                  { key: "District", label: "District" },
                  { key: "DSD", label: "DS Division" },
                  { key: "GND", label: "GN Division" },
                  { key: "AI /LDO Di", label: "AI /LDO Division" },
                  { key: "Phone Numb", label: "Phone Number" },
                  { key: "WhatsApp", label: "WhatsApp" },
                  { key: "Lat", label: "Latitude" },
                  { key: "lng", label: "Longitude" },
                ],
              },
            ]
          : [
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
                title: "Project Details",
                fields: [
                  { key: "Project", label: "Project" },
                  { key: "ProjectInp", label: "Benefit Provided" },
                  { key: "Status of", label: "Project Status" },
                  { key: "Remark", label: "Remark" },
                  { key: "Total", label: "Total Score" },
                  { key: "Rank", label: "Rank" },
                ],
              },
            ];

        const keyAliases: Record<string, string[]> = {
          ProjectInp: ["ProjectInp", "Project Input"],
          "Name of th": SOCIETY_KEYS,
          "Contact Pe": CONTACT_PERSON_KEYS,
          "AI /LDO Di": AI_LDO_KEYS,
          "Phone Numb": PHONE_KEYS,
        };

        const getValue = (key: string) => {
          if (key === "HomeProject") {
            return getHomeProjectValue(properties);
          }

          if (key === "ProjectInp" && isFoodSecurityFeature(properties)) {
            return formatFoodSecurityBenefit(properties?.ProjectInp);
          }

          return getPropertyValue(properties, keyAliases[key] || [key]);
        };

        const hasValue = (value: unknown) =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !== "";

        const renderValue = (key: string, value: unknown) => {
          let displayValue = String(value);

          if (key === "Project" || key === "HomeProject") {
            displayValue = formatProjectDisplay(value);
          }

          return displayValue.replace(/\n/g, "<br/>");
        };

        let html = `<div style="font-size:13px; line-height:1.45; max-height:320px; overflow:auto; min-width:260px;">`;

        sections.forEach((section) => {
          const rows = section.fields
            .filter(({ key }) => hasValue(getValue(key)))
            .map(
              ({ key, label }) =>
                `<div style="margin:0 0 6px;"><strong>${label}:</strong> ${renderValue(key, getValue(key))}</div>`
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

        layer.bindPopup(html, {
          maxWidth: 340,
          autoPan: true,
          keepInView: true,
        });
      }
    });

    beneficiaryClusterGroup.addLayer(pointLayer);

    if (!map.hasLayer(beneficiaryClusterGroup)) {
      map.addLayer(beneficiaryClusterGroup);
    }
  };

  const loadBeneficiaryPoints = async (
      selectedDistrictNames: string[],
      categoryColumn: string | undefined
  ) => {
    if (!map || !beneficiaryClusterGroup) return;

    const requestId = ++beneficiaryRequestId;
    const bounds = map.getBounds();

    if (
        lastBeneficiaryGeojson &&
        lastBeneficiaryBounds &&
        lastBeneficiaryBounds.contains(bounds)
    ) {
      renderBeneficiaryPoints(
          lastBeneficiaryGeojson,
          selectedDistrictNames,
          categoryColumn
      );
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
      "EPSG:4326"
    ].join(",");

    const layerCqlEntries = HOME_BENEFICIARY_TYPE_NAMES.map((typeName) => [
      typeName,
      buildBeneficiaryCql(typeName, selectedDistrictNames, categoryColumn)
    ] as const);

    const hasLayerCql = layerCqlEntries.some(([, cql]) => !!cql);
    const fetchKey = hasLayerCql
      ? layerCqlEntries.map(([typeName, cql]) => `${typeName}:${cql || "all"}`).join("|")
      : `${HOME_BENEFICIARY_TYPE_NAMES.join("+")}|${bbox}`;

    if (lastBeneficiaryGeojson && lastBeneficiaryFetchKey === fetchKey) {
      renderBeneficiaryPoints(
          lastBeneficiaryGeojson,
          selectedDistrictNames,
          categoryColumn
      );
      return;
    }

    const interval = startLoading();

    try {
      const geojsonCollections = await Promise.all(
        layerCqlEntries.map(async ([typeName, cql]) => {
          const url = buildWfsUrl(
              BENEFICIARY_WFS_URL,
              typeName,
              hasLayerCql
                ? cql
                  ? { CQL_FILTER: cql }
                  : {}
                : { BBOX: bbox }
          );

          const geojson = await fetchGeoJsonWithCache(
              url,
              `${typeName} beneficiary WFS`,
              beneficiaryAbortController?.signal
          );

          return geojson ? addSourceLayerToGeojson(geojson, typeName) : null;
        })
      );

      const geojson = mergeFeatureCollections(geojsonCollections.filter(Boolean));

      if (requestId !== beneficiaryRequestId) {
        stopLoading(interval);
        return;
      }

      lastBeneficiaryGeojson = geojson;
      lastBeneficiaryBounds = paddedBounds;
      lastBeneficiaryFetchKey = fetchKey;

      renderBeneficiaryPoints(
          geojson,
          selectedDistrictNames,
          categoryColumn
      );

      stopLoading(interval);
    } catch (error: any) {
      if (error?.name === "AbortError") {
        stopLoading(interval);
        return;
      }

      console.error("Error loading beneficiary WFS", error);
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

  const initMap = () => {
    const L = (window as any).L;
    if (!L || map) return;

    map = L.map("home-map", {
      center: [
        currentDistrict.value?.lat || 7.9,
        currentDistrict.value?.lng || 80.6
      ],
      zoom: 8,
      minZoom: 6,
      maxZoom: 14
    });

    const LAny = L as any;

    if (LAny.Control && LAny.Control.FullScreen) {
      map.addControl(new LAny.Control.FullScreen({ position: "topleft" }));
    }

    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
          maxZoom: 13
        }
    ).addTo(map);

    if (!map.getPane(BOUNDARY_PANE)) {
      map.createPane(BOUNDARY_PANE);
      map.getPane(BOUNDARY_PANE).style.zIndex = "450";
      map.getPane(BOUNDARY_PANE).style.pointerEvents = "none";
    }

    if (!map.getPane(BENEFICIARY_PANE)) {
      map.createPane(BENEFICIARY_PANE);
      map.getPane(BENEFICIARY_PANE).style.zIndex = "650";
    }

    if (LAny.markerClusterGroup) {
      beneficiaryClusterGroup = LAny.markerClusterGroup({
        clusterPane: BENEFICIARY_PANE,
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
            iconSize: [34, 34]
          });
        }
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

    updateLayers(true);
  };

  const recenterOnDistricts = () => {
    if (!map || !currentDistrict.value) return;

    const district = currentDistrict.value;

    lastBeneficiaryGeojson = null;
    lastBeneficiaryBounds = null;
    lastBeneficiaryFetchKey = "";

    map.setView([district.lat, district.lng], Math.max(map.getZoom() || 7, 9));
  };

  const updateLayers = async (forceBoundaryReload = true) => {
    const L = (window as any).L;
    if (!map || !L) return;

    const zoom = map.getZoom() || 7;
    const selectedDistrictNames = getSelectedDistrictNames();
    const selectedCategoryId: string = props.selectedSubCategory;
    const categoryColumn = selectedCategoryId === "all" ? undefined : selectedCategoryId;

    if (props.showBoundaries) {
      await loadBoundaryLayers(
          selectedDistrictNames,
          zoom,
          categoryColumn,
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

    await loadBeneficiaryPoints(selectedDistrictNames, categoryColumn);
  };

  return {
    initMap,
    updateLayers,
    recenterOnDistricts,
    loadingProgress,
    refreshSize
  };
}
