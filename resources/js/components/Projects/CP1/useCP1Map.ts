// useCP1Map.ts

export function useCP1Map(props: any, primaryDistrict: any) {
    const BENEFICIARY_WMS_URL =
        "https://geoserver.gsentry.cloud/geoserver/UNDP/wms";
    const BENEFICIARY_WFS_URL =
        "https://geoserver.gsentry.cloud/geoserver/UNDP/wfs";

    const BOUNDARY_WMS_URL =
        "https://geoserver.gsentry.cloud/geoserver/AdminBoundary/wms";

    // Map subCategory.id -> actual GeoServer column names (truncated)
    const categoryColumnMap: Record<string, string> = {
        coops: "Coops",
        chicks: "Chicks",
        feeder_dri: "Feeder_Dri",
        trainings: "Trainings",
        maize_cult: "Maize_Cult",
    };

    let map: any = null;

    let baseLayer: any = null;
    let districtBoundaryLayer: any = null;
    let dsdBoundaryLayer: any = null;
    let beneficiaryWmsLayer: any = null;
    let beneficiaryClusterGroup: any = null;

    const initMap = () => {
        const L = (window as any).L;
        if (!L) return;

        map = L.map("cp1-map", {
            center: [
                primaryDistrict.value?.lat || 7.9,
                primaryDistrict.value?.lng || 80.6,
            ],
            zoom: 8,
            minZoom: 6,
            maxZoom: 14,
        });

        baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // District boundaries
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

        // DSD boundaries (start hidden)
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

        // Beneficiaries WMS (low zoom)
        beneficiaryWmsLayer = L.tileLayer.wms(BENEFICIARY_WMS_URL, {
            layers: "UNDP:all_benefics",
            format: "image/png",
            transparent: true,
        });

        const LAny = L as any;
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
        if (!map || !primaryDistrict.value) return;
        const d = primaryDistrict.value;
        map.setView([d.lat, d.lng], Math.max(map.getZoom() || 7, 9));
    };

    const getSelectedDistrictNames = (): string[] => {
        const ids: string[] = props.selectedDistricts || [];
        const allDistricts: any[] = props.districts || [];
        if (!ids.length) {
            return []; // means "all"
        }
        return ids
            .map((id) => allDistricts.find((d) => d.id === id))
            .filter(Boolean)
            .map((d: any) => d.name);
    };

    const updateLayers = async () => {
        const L = (window as any).L;
        if (!map || !L) return;

        const zoom = map.getZoom() || 7;
        const selectedDistrictNames = getSelectedDistrictNames();

        const selectedCategoryId: string = props.selectedSubCategory;
        const categoryColumn: string | undefined =
            categoryColumnMap[selectedCategoryId];

        /* ---------- BOUNDARIES: only selected districts (or all) ---------- */

        if (props.showBoundaries) {
            let districtCql = "1=1";
            if (selectedDistrictNames.length === 1) {
                districtCql = `District = '${selectedDistrictNames[0]}'`;
            } else if (selectedDistrictNames.length > 1) {
                const list = selectedDistrictNames
                    .map((n) => `'${n}'`)
                    .join(",");
                districtCql = `District IN (${list})`;
            }

            districtBoundaryLayer.setParams(
                {
                    CQL_FILTER: districtCql,
                    _ts: Date.now(),
                },
                false
            );
            if (!map.hasLayer(districtBoundaryLayer)) {
                map.addLayer(districtBoundaryLayer);
            }

            if (zoom >= 9) {
                dsdBoundaryLayer.setParams(
                    {
                        CQL_FILTER: districtCql,
                        _ts: Date.now(),
                    },
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

        /* ---------- BENEFICIARIES ---------- */

        const clearCluster = () => {
            if (!beneficiaryClusterGroup) return;
            beneficiaryClusterGroup.clearLayers();
            if (map.hasLayer(beneficiaryClusterGroup)) {
                map.removeLayer(beneficiaryClusterGroup);
            }
        };

        if (!props.showBeneficiaries) {
            if (beneficiaryWmsLayer && map.hasLayer(beneficiaryWmsLayer)) {
                map.removeLayer(beneficiaryWmsLayer);
            }
            clearCluster();
            return;
        }

        // Build CQL filter for WMS
        const baseCqlParts: string[] = [];
        if (selectedDistrictNames.length === 1) {
            baseCqlParts.push(`District = '${selectedDistrictNames[0]}'`);
        } else if (selectedDistrictNames.length > 1) {
            const list = selectedDistrictNames
                .map((n) => `'${n}'`)
                .join(",");
            baseCqlParts.push(`District IN (${list})`);
        } else {
            baseCqlParts.push("1=1");
        }

        if (categoryColumn) {
            baseCqlParts.push(`${categoryColumn} > 0`);
        }
        const beneficiaryCql = baseCqlParts.join(" AND ");

        if (zoom < 9) {
            // Low zoom → WMS only
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
            // High zoom → WFS + clustered GeoJSON
            if (beneficiaryWmsLayer && map.hasLayer(beneficiaryWmsLayer)) {
                map.removeLayer(beneficiaryWmsLayer);
            }

            clearCluster();

            const bounds = map.getBounds();
            const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()},EPSG:4326`;

            const url =
                `${BENEFICIARY_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature` +
                `&typeName=UNDP:all_benefics&outputFormat=application/json` +
                `&srsName=EPSG:4326&bbox=${bbox}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error("Beneficiary WFS request failed", response.statusText);
                    return;
                }

                const geojson = await response.json();

                const pointLayer = L.geoJSON(geojson, {
                    filter: (feature: any) => {
                        const p = feature.properties || {};
                        if (selectedDistrictNames.length) {
                            if (!selectedDistrictNames.includes(p.District)) {
                                return false;
                            }
                        }
                        if (!categoryColumn) return true;

                        const raw = p[categoryColumn];
                        if (raw === null || raw === undefined || raw === "") return false;
                        const num =
                            typeof raw === "number" ? raw : parseFloat(String(raw));
                        return !isNaN(num) && num > 0;
                    },
                    pointToLayer: (feature: any, latlng: any) =>
                        L.circleMarker(latlng, {
                            radius: 7,
                            weight: 1.3,
                            color: "#1d4ed8",
                            fillColor: "#3b82f6",
                            fillOpacity: 0.9,
                        }),
                    onEachFeature: (feature: any, layer: any) => {
                        const p = feature.properties || {};

                        let html =
                            `<div style="font-size:13px; line-height:1.4; max-height:260px; overflow:auto;">`;

                        Object.entries(p).forEach(([key, val]) => {
                            if (key === "the_geom") return;
                            if (val === null || val === undefined || val === "") return;
                            html += `<strong>${key}:</strong> ${val}<br/>`;
                        });

                        html += `</div>`;

                        layer.bindPopup(html, {
                            maxWidth: 320,
                            maxHeight: 280,
                            autoPan: true,
                            keepInView: true,
                        });
                    },
                });

                beneficiaryClusterGroup.addLayer(pointLayer);
                if (!map.hasLayer(beneficiaryClusterGroup)) {
                    map.addLayer(beneficiaryClusterGroup);
                }
            } catch (err) {
                console.error("Error loading beneficiary WFS", err);
            }
        }
    };

    return { initMap, updateLayers, recenterOnDistricts };
}
