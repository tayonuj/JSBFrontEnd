export function useCP1Map(props: any, currentDistrict: any) {
    let map: any = null;
    let beneficiariesLayer: any = null;
    let boundariesLayer: any = null;

    const initMap = () => {
        const L = (window as any).L;
        if (!L) return;

        map = L.map("cp1-map", {
            center: [currentDistrict.value.lat, currentDistrict.value.lng],
            zoom: 7,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        beneficiariesLayer = L.layerGroup().addTo(map);
        boundariesLayer = L.layerGroup().addTo(map);

        updateLayers();
    };

    const updateLayers = () => {
        const L = (window as any).L;
        if (!map) return;

        beneficiariesLayer.clearLayers();
        boundariesLayer.clearLayers();

        // Beneficiaries
        if (props.showBeneficiaries) {
            props.districts.forEach((d: any) => {
                const stat = props.statsFor(d.id, props.selectedSubCategory);
                if (!stat.beneficiaries) return;

                L.circleMarker([d.lat, d.lng], {
                    radius: 6 + Math.log(stat.beneficiaries),
                    color: "#2563eb",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.7,
                }).addTo(beneficiariesLayer);
            });
        }

        // Boundaries (fake demo squares)
        if (props.showBoundaries) {
            props.districts.forEach((d: any) => {
                const L = (window as any).L;
                const corners = [
                    [d.lat + 0.2, d.lng - 0.2],
                    [d.lat + 0.2, d.lng + 0.2],
                    [d.lat - 0.2, d.lng + 0.2],
                    [d.lat - 0.2, d.lng - 0.2],
                ];
                L.polygon(corners, { color: "#16a34a", fillOpacity: 0.05 })
                    .addTo(boundariesLayer);
            });
        }

        // Re-center
        map.setView([currentDistrict.value.lat, currentDistrict.value.lng], 8);
    };

    return { initMap, updateLayers };
}
