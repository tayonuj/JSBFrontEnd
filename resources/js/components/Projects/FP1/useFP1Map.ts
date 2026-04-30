import { ref } from "vue";

export function useFP1Map(props: any, currentDistrict: any) {
  const BENEFICIARY_WFS_URL = "https://geoserver.gsentry.cloud/geoserver/UNDP/wfs";
  const BOUNDARY_WFS_URL = "https://geoserver.gsentry.cloud/geoserver/AdminBoundary/wfs";

  const categoryColumnMap: Record<string, string> = {
    coops: "Coops",
    chicks: "Chicks",
    feeder_dri: "Feeder_Dri",
    trainings: "Trainings",
    maize_cult: "Maize_Cult"
  };
  const categoryPointColorMap: Record<string, string> = {
    coops: "#2f77e2",
    chicks: "#35c78a",
    feeder_dri: "#ffb547",
    trainings: "#8b5cf6",
    maize_cult: "#f06292"
  };

  const DISTRICT_KEYS = ["District", "district", "DISTRICT", "NAME_1"];
  const DSD_KEYS = ["DSD", "dsd", "Dsd", "DSD_N", "NAME_2"];

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

  const getPropertyValue = (properties: any, keys: string[]) => {
    for (const key of keys) {
      const value = properties?.[key];
      if (value !== null && value !== undefined && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return "";
  };

  const hasValidCategoryValue = (properties: any, categoryColumn: string | undefined) => {
    if (!categoryColumn) return true;

    const raw = properties?.[categoryColumn];

    if (raw === null || raw === undefined || raw === "") {
      return false;
    }

    const value = typeof raw === "number" ? raw : parseFloat(String(raw));
    return !Number.isNaN(value) && value > 0;
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
      categoryColumn: string | undefined,
      signal?: AbortSignal
  ) => {
    const districtCounts = new Map<string, number>();
    const dsdCounts = new Map<string, number>();

    const districtCql = buildDistrictCql(selectedDistrictNames);

    const propertyNames = Array.from(
        new Set([
          ...DISTRICT_KEYS,
          ...DSD_KEYS,
          ...(categoryColumn ? [categoryColumn] : [])
        ])
    ).join(",");

    const url = buildWfsUrl(BENEFICIARY_WFS_URL, "UNDP:all_benefics", {
      CQL_FILTER: districtCql,
      propertyName: propertyNames
    });

    const geojson = await fetchGeoJsonWithCache(
        url,
        "Beneficiary count WFS",
        signal
    );

    if (!geojson?.features?.length) {
      return {
        districtCounts,
        dsdCounts,
        maxDistrictCount: 0,
        maxDsdCount: 0
      };
    }

    const selectedDistrictSet = new Set(
        selectedDistrictNames.map((name) => normalizeName(name))
    );

    for (const feature of geojson.features) {
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
        pane: "boundaryPane",
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
          pane: "boundaryPane",
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

    const activeCategoryId =
        Object.entries(categoryColumnMap).find(
            ([, value]) => value === categoryColumn
        )?.[0] || "";
    const pointFillColor = categoryPointColorMap[activeCategoryId] || "#16a34a";

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
          L.circleMarker(latlng, {
            radius: 3.4,
            weight: 0.8,
            color: "#ffffff",
            fillColor: pointFillColor,
            fillOpacity: 0.9
          }),

      onEachFeature: (feature: any, layer: any) => {
        const properties = feature.properties || {};
        let html = `<div style="font-size:13px; line-height:1.4; max-height:260px; overflow:auto;">`;

        Object.entries(properties).forEach(([key, value]) => {
          if (key === "the_geom") return;
          if (value === null || value === undefined || value === "") return;

          html += `<strong>${key}:</strong> ${value}<br/>`;
        });

        html += `</div>`;

        layer.bindPopup(html, {
          maxWidth: 320,
          maxHeight: 280,
          autoPan: false,
          keepInView: false
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

    const fetchKey = bbox;

    if (lastBeneficiaryGeojson && lastBeneficiaryFetchKey === fetchKey) {
      renderBeneficiaryPoints(
          lastBeneficiaryGeojson,
          selectedDistrictNames,
          categoryColumn
      );
      return;
    }

    const url = buildWfsUrl(
        BENEFICIARY_WFS_URL,
        "UNDP:all_benefics",
        {
          BBOX: bbox
        }
    );

    const interval = startLoading();

    try {
      const geojson = await fetchGeoJsonWithCache(
          url,
          "Beneficiary WFS",
          beneficiaryAbortController.signal
      );

      if (!geojson || requestId !== beneficiaryRequestId) {
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

    map = L.map("fp1-map", {
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
    const categoryColumn = categoryColumnMap[selectedCategoryId];

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
