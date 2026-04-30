import { ref, watch } from "vue";

export function useCP4Map(props: any, currentDistrict: any) {
    const BENEFICIARY_WMS_URL =
        "https://geoserver.gsentry.cloud/geoserver/UNDP/wms";
    const BENEFICIARY_WFS_URL =
        "https://geoserver.gsentry.cloud/geoserver/UNDP/wfs";

    const BOUNDARY_WMS_URL =
        "https://geoserver.gsentry.cloud/geoserver/AdminBoundary/wms";

    const DISTRICT_ALIASES_BY_ID: Record<string, string[]> = {
        nuwara_eliya: [
            "Nuwara Eliya",
            "Nuwara-Eliya",
            "Nuwara. Eliya",
            "Nuwareliya",
        ],
    };

    let map: any = null;
    let baseLayer: any = null;
    let districtBoundaryLayer: any = null;
    let dsdBoundaryLayer: any = null;
    let beneficiaryWmsLayer: any = null;
    let beneficiaryClusterGroup: any = null;

    const loadingProgress = ref(0);
    const isLoading = ref(false);

    const startLoading = (): number | null => {
        if (isLoading.value) return null;
        isLoading.value = true;
        loadingProgress.value = 10;

        const interval = window.setInterval(() => {
            if (loadingProgress.value < 90) loadingProgress.value += 10;
        }, 200);

        return interval;
    };

    const stopLoading = (interval: number | null) => {
        if (interval !== null) window.clearInterval(interval);

        loadingProgress.value = 100;
        setTimeout(() => {
            loadingProgress.value = 0;
            isLoading.value = false;
        }, 500);
    };

    const escapeCqlValue = (value: string) => String(value).replace(/'/g, "''");

    const getSelectedDistrictNames = (): string[] => {
        const ids: string[] = props.selectedDistricts || [];
        const all: any[] = props.districts || [];

        if (!ids.length) return [];

        return ids
            .map((id) => all.find((d) => d.id === id))
            .filter(Boolean)
            .map((d: any) => d.name);
    };

    // const getSelectedDistrictFilterValues = (): string[] => {
    //     const ids: string[] = props.selectedDistricts || [];
    //     const all: any[] = props.districts || [];
    //
    //     if (!ids.length) return [];
    //
    //     const values = ids.flatMap((id) => {
    //         const aliases = DISTRICT_ALIASES_BY_ID[id];
    //         if (aliases?.length) return aliases;
    //
    //         const found = all.find((d) => d.id === id);
    //         return found ? [found.name] : [];
    //     });
    //
    //     return [...new Set(values)];
    // };

    const getCurrentCategory = () => {
        return (props.subCategories || []).find(
            (c: any) => c.id === props.selectedSubCategory
        );
    };

    const getSelectedOptionValues = (): string[] => {
        const category = getCurrentCategory();
        if (!category) return [];

        const option = (category.options || []).find(
            (o: any) => o.id === props.selectedSubCategoryOption
        );

        return option?.values || [];
    };

    const buildBeneficiaryCql = (): string => {
        const category = getCurrentCategory();
        const categoryColumn: string | undefined = category?.column;
        const selectedOptionValues = getSelectedOptionValues();
        // const districtValues = getSelectedDistrictFilterValues();

        const cqlParts: string[] = [];

        // if (districtValues.length === 1) {
        //     cqlParts.push(`"District" = '${escapeCqlValue(districtValues[0])}'`);
        // } else if (districtValues.length > 1) {
        //     const values = districtValues
        //         .map((v) => `'${escapeCqlValue(v)}'`)
        //         .join(",");
        //     cqlParts.push(`"District" IN (${values})`);
        // }

        if (categoryColumn && selectedOptionValues.length === 1) {
            cqlParts.push(
                `"${categoryColumn}" = '${escapeCqlValue(selectedOptionValues[0])}'`
            );
        } else if (categoryColumn && selectedOptionValues.length > 1) {
            const values = selectedOptionValues
                .map((v) => `'${escapeCqlValue(v)}'`)
                .join(",");
            cqlParts.push(`"${categoryColumn}" IN (${values})`);
        }

        return cqlParts.length ? cqlParts.join(" AND ") : "1=1";
    };

    const buildPopupHtml = (properties: Record<string, any>) => {
        const orderedFields = [
            "Name_of_th",
            "District",
            "DS_Divisio",
            "GN_Divisio",
            "Type_of_Fa",
            "Gender",
            "Age",
            "ID_Number_",
            "Proposed_b",
            "NIC_of_Pro",
            "Age_of_Pro",
            "Address",
            "Land_Owner",
            "Telephone",
            "WhatssApp_",
            "__of__Fami",
            "Family_Mem",
            "Income_sou",
            "Income__LK",
            "Electricit",
            "Capacity",
            "Estate_wor",
            "Current_En",
            "Monthly__A",
            "Roof_Type_",
            "Roof_Condi",
            "Available_",
            "Number_of_",
            "Availabl_1",
            "Space_avai",
            "Individual",
            "Income_Sep",
            "Coockstove",
            "Continious",
            "Current_Ag",
            "Project_In",
            "Status_of_",
            "Remark",
            "cluster_Ag",
        ];

        let html =
            `<div style="font-size:13px; line-height:1.45; max-height:300px; overflow:auto;">`;

        orderedFields.forEach((key) => {
            const val = properties[key];
            if (val === null || val === undefined || val === "") return;
            html += `<strong>${key}:</strong> ${val}<br/>`;
        });

        html += `</div>`;
        return html;
    };

    const initMap = () => {
        const L = (window as any).L;
        if (!L) return;

        map = L.map("cp1-map", {
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

        baseLayer = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "&copy; OpenStreetMap contributors",
            }
        ).addTo(map);

        districtBoundaryLayer = L.tileLayer.wms(BOUNDARY_WMS_URL, {
            layers: "AdminBoundary:Districts",
            format: "image/png",
            transparent: true,
            sld_body: `
<StyledLayerDescriptor version="1.0.0">
  <NamedLayer>
    <Name>AdminBoundary:Districts</Name>
    <UserStyle>
      <FeatureTypeStyle>
        <Rule>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#ffcccc</CssParameter>
              <CssParameter name="fill-opacity">0.35</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#ff0000</CssParameter>
              <CssParameter name="stroke-width">1.6</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
      `,
        });

        dsdBoundaryLayer = L.tileLayer.wms(BOUNDARY_WMS_URL, {
            layers: "AdminBoundary:DSD",
            format: "image/png",
            transparent: true,
            CQL_FILTER: "1=0",
            sld_body: `
<StyledLayerDescriptor version="1.0.0">
  <NamedLayer>
    <Name>AdminBoundary:DSD</Name>
    <UserStyle>
      <FeatureTypeStyle>
        <Rule>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#ffe6e6</CssParameter>
              <CssParameter name="fill-opacity">0.25</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#ff0000</CssParameter>
              <CssParameter name="stroke-width">1.2</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
      `,
        });

        beneficiaryWmsLayer = L.tileLayer.wms(BENEFICIARY_WMS_URL, {
            layers: "UNDP:jsb4_nuwaraeliya",
            format: "image/png",
            transparent: true,
            CQL_FILTER: "1=1",
        });

        if (LAny.markerClusterGroup) {
            beneficiaryClusterGroup = LAny.markerClusterGroup({
                disableClusteringAtZoom: 13,
                spiderfyOnEveryZoom: false,
            });
        } else {
            beneficiaryClusterGroup = L.layerGroup();
        }

        map.on("zoomend", () => {
            updateLayers();
        });

        updateLayers();
    };

    const recenterOnDistricts = () => {
        if (!map || !currentDistrict.value) return;
        const d = currentDistrict.value;
        map.setView([d.lat, d.lng], Math.max(map.getZoom() || 7, 9));
    };

    const refreshSize = () => {
        if (!map) return;
        window.requestAnimationFrame(() => {
            map.invalidateSize();
        });
    };

    const clearCluster = () => {
        if (!beneficiaryClusterGroup) return;
        beneficiaryClusterGroup.clearLayers();
        if (map && map.hasLayer(beneficiaryClusterGroup)) {
            map.removeLayer(beneficiaryClusterGroup);
        }
    };

    const updateLayers = async () => {
        const L = (window as any).L;
        if (!map || !L) return;

        const zoom = map.getZoom() || 7;
        const selectedDistrictNames = getSelectedDistrictNames();
        // const selectedDistrictFilterValues = getSelectedDistrictFilterValues();
        const beneficiaryCql = buildBeneficiaryCql();
        const currentCategory = getCurrentCategory();
        const categoryColumn = currentCategory?.column;
        const selectedOptionValues = getSelectedOptionValues();

        if (props.showBoundaries) {
            let districtCql = "1=1";

            if (selectedDistrictNames.length === 1) {
                districtCql = `District = '${escapeCqlValue(selectedDistrictNames[0])}'`;
            } else if (selectedDistrictNames.length > 1) {
                const list = selectedDistrictNames
                    .map((n) => `'${escapeCqlValue(n)}'`)
                    .join(",");
                districtCql = `District IN (${list})`;
            }

            districtBoundaryLayer.setParams(
                { CQL_FILTER: districtCql, _ts: Date.now() },
                false
            );

            if (!map.hasLayer(districtBoundaryLayer)) {
                map.addLayer(districtBoundaryLayer);
            }

            if (zoom >= 9) {
                dsdBoundaryLayer.setParams(
                    { CQL_FILTER: districtCql, _ts: Date.now() },
                    false
                );

                if (!map.hasLayer(dsdBoundaryLayer)) {
                    map.addLayer(dsdBoundaryLayer);
                }
            } else if (map.hasLayer(dsdBoundaryLayer)) {
                map.removeLayer(dsdBoundaryLayer);
            }
        } else {
            if (districtBoundaryLayer && map.hasLayer(districtBoundaryLayer)) {
                map.removeLayer(districtBoundaryLayer);
            }
            if (dsdBoundaryLayer && map.hasLayer(dsdBoundaryLayer)) {
                map.removeLayer(dsdBoundaryLayer);
            }
        }

        if (!props.showBeneficiaries) {
            if (beneficiaryWmsLayer && map.hasLayer(beneficiaryWmsLayer)) {
                map.removeLayer(beneficiaryWmsLayer);
            }
            clearCluster();
            return;
        }

        if (zoom < 9) {
            clearCluster();

            beneficiaryWmsLayer.setParams(
                {
                    CQL_FILTER: beneficiaryCql,
                    _ts: Date.now(),
                },
                false
            );

            if (!map.hasLayer(beneficiaryWmsLayer)) {
                map.addLayer(beneficiaryWmsLayer);
            }
        } else {
            if (beneficiaryWmsLayer && map.hasLayer(beneficiaryWmsLayer)) {
                map.removeLayer(beneficiaryWmsLayer);
            }

            clearCluster();

            let url =
                `${BENEFICIARY_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature` +
                `&typeName=UNDP:jsb4_nuwaraeliya&outputFormat=application/json` +
                `&srsName=EPSG:4326`;

            if (beneficiaryCql !== "1=1") {
                url += `&cql_filter=${encodeURIComponent(beneficiaryCql)}`;
            }

            const interval = startLoading();

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    stopLoading(interval);
                    return;
                }

                const geojson = await response.json();

                const pointLayer = L.geoJSON(geojson, {
                    filter: (feature: any) => {
                        const p = feature.properties || {};

                        if (!categoryColumn || !selectedOptionValues.length) return true;

                        const raw = String(p[categoryColumn] ?? "").trim().toLowerCase();

                        return selectedOptionValues.some(
                            (v) => raw === String(v).trim().toLowerCase()
                        );
                    },
                    pointToLayer: (_feature: any, latlng: any) =>
                        L.circleMarker(latlng, {
                            radius: 7,
                            weight: 1.3,
                            color: "#1d4ed8",
                            fillColor: "#3b82f6",
                            fillOpacity: 0.9,
                        }),
                    onEachFeature: (feature: any, layer: any) => {
                        const p = feature.properties || {};
                        layer.bindPopup(buildPopupHtml(p), {
                            maxWidth: 340,
                            maxHeight: 300,
                            autoPan: true,
                            keepInView: true,
                        });
                    },
                });

                beneficiaryClusterGroup.addLayer(pointLayer);

                if (!map.hasLayer(beneficiaryClusterGroup)) {
                    map.addLayer(beneficiaryClusterGroup);
                }

                stopLoading(interval);
            } catch (err) {
                console.error(err);
                stopLoading(interval);
            }
        }
    };

    watch(
        () => [
            props.selectedDistricts,
            props.selectedSubCategory,
            props.selectedSubCategoryOption,
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
