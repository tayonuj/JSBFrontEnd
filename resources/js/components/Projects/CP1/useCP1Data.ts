// useCP1Data.ts
import { ref, computed } from "vue";

type Stat = {
    beneficiaries: number;
    supportValue: number;
    womenLed: number;
    youth: number;
};

export function useCP1Data() {
    // All districts from your layer
    const districts = [
        { id: "anuradhapura", name: "Anuradhapura", lat: 8.4052896186, lng: 80.4522012153 },
        { id: "kilinochchi", name: "Kilinochchi", lat: 9.4246229378, lng: 80.3937666654 },
        { id: "mannar", name: "Mannar", lat: 8.87088353, lng: 80.0644309346 },
        { id: "mullaitivu", name: "Mullaitivu", lat: 9.2629130875, lng: 80.6985330177 },
        { id: "polonnaruwa", name: "Polonnaruwa", lat: 8.1695806545, lng: 80.8934517649 },
        { id: "trincomalee", name: "Trincomalee", lat: 8.6190515714, lng: 80.9895852838 },
        { id: "vavuniya", name: "Vavuniya", lat: 8.7363602123, lng: 80.4151425052 },
    ];

    // Category filters mapped to GeoServer column names
    const subCategories = [
        { id: "coops",      label: "Coops / housing",         column: "Coops" },
        { id: "chicks",     label: "Chicks distribution",     column: "Chicks" },
        { id: "feeder_dri", label: "Feeders & drinkers",      column: "Feeder_Dri" },
        { id: "trainings",  label: "Trainings",               column: "Trainings" },
        { id: "maize_cult", label: "Maize cultivation",       column: "Maize_Cult" },
    ];

    // Precomputed from total_beneficieries.csv
    const statsMap: Record<string, Stat> = {
        // anuradhapura
        "anuradhapura|coops":      { beneficiaries: 1486, supportValue: 1486.0,  womenLed: 98.1, youth: 25.7 },
        "anuradhapura|chicks":     { beneficiaries: 1504, supportValue: 30080.0, womenLed: 98.0, youth: 26.5 },
        "anuradhapura|feeder_dri": { beneficiaries: 1504, supportValue: 1504.0,  womenLed: 98.0, youth: 26.5 },
        "anuradhapura|trainings":  { beneficiaries: 1502, supportValue: 1502.0,  womenLed: 98.0, youth: 26.4 },
        "anuradhapura|maize_cult": { beneficiaries: 20,   supportValue: 20.0,    womenLed: 35.0, youth: 15.0 },

        // kilinochchi
        "kilinochchi|coops":       { beneficiaries: 1250, supportValue: 1250.0,  womenLed: 93.0, youth: 19.4 },
        "kilinochchi|chicks":      { beneficiaries: 1250, supportValue: 25000.0, womenLed: 93.0, youth: 19.4 },
        "kilinochchi|feeder_dri":  { beneficiaries: 1250, supportValue: 1250.0,  womenLed: 93.0, youth: 19.4 },
        "kilinochchi|trainings":   { beneficiaries: 1058, supportValue: 1058.0,  womenLed: 94.0, youth: 19.3 },
        "kilinochchi|maize_cult":  { beneficiaries: 19,   supportValue: 19.0,    womenLed: 0.0,  youth: 0.0 },

        // mannar
        "mannar|coops":            { beneficiaries: 725,  supportValue: 725.0,   womenLed: 95.9, youth: 19.9 },
        "mannar|chicks":           { beneficiaries: 748,  supportValue: 15110.0, womenLed: 96.0, youth: 19.8 },
        "mannar|feeder_dri":       { beneficiaries: 748,  supportValue: 748.0,   womenLed: 96.0, youth: 19.9 },
        "mannar|trainings":        { beneficiaries: 698,  supportValue: 698.0,   womenLed: 96.4, youth: 19.2 },
        "mannar|maize_cult":       { beneficiaries: 21,   supportValue: 21.0,    womenLed: 4.8,  youth: 0.0 },

        // mullaitivu
        "mullaitivu|coops":        { beneficiaries: 1364, supportValue: 1364.0,  womenLed: 98.5, youth: 10.4 },
        "mullaitivu|chicks":       { beneficiaries: 1364, supportValue: 27280.0, womenLed: 98.5, youth: 10.4 },
        "mullaitivu|feeder_dri":   { beneficiaries: 1364, supportValue: 1364.0,  womenLed: 98.5, youth: 10.4 },
        "mullaitivu|trainings":    { beneficiaries: 745,  supportValue: 745.0,   womenLed: 97.4, youth: 8.7 },
        "mullaitivu|maize_cult":   { beneficiaries: 19,   supportValue: 19.0,    womenLed: 5.3,  youth: 0.0 },

        // polonnaruwa
        "polonnaruwa|coops":       { beneficiaries: 750,  supportValue: 750.0,   womenLed: 98.9, youth: 31.3 },
        "polonnaruwa|chicks":      { beneficiaries: 750,  supportValue: 15000.0, womenLed: 98.9, youth: 31.3 },
        "polonnaruwa|feeder_dri":  { beneficiaries: 765,  supportValue: 765.0,   womenLed: 98.7, youth: 32.4 },
        "polonnaruwa|trainings":   { beneficiaries: 750,  supportValue: 750.0,   womenLed: 98.9, youth: 31.3 },
        "polonnaruwa|maize_cult":  { beneficiaries: 20,   supportValue: 20.0,    womenLed: 60.0, youth: 10.0 },

        // trincomalee
        "trincomalee|coops":       { beneficiaries: 1027, supportValue: 1027.0,  womenLed: 98.0, youth: 30.7 },
        "trincomalee|chicks":      { beneficiaries: 1028, supportValue: 20560.0, womenLed: 98.0, youth: 30.6 },
        "trincomalee|feeder_dri":  { beneficiaries: 1032, supportValue: 1032.0,  womenLed: 98.0, youth: 30.5 },
        "trincomalee|trainings":   { beneficiaries: 835,  supportValue: 835.0,   womenLed: 97.5, youth: 31.0 },
        "trincomalee|maize_cult":  { beneficiaries: 20,   supportValue: 20.0,    womenLed: 15.0, youth: 0.0 },

        // vavuniya
        "vavuniya|coops":          { beneficiaries: 1483, supportValue: 1483.0,  womenLed: 99.3, youth: 32.2 },
        "vavuniya|chicks":         { beneficiaries: 1503, supportValue: 30210.0, womenLed: 99.3, youth: 31.9 },
        "vavuniya|feeder_dri":     { beneficiaries: 1503, supportValue: 1503.0,  womenLed: 99.3, youth: 31.9 },
        "vavuniya|trainings":      { beneficiaries: 1503, supportValue: 1503.0,  womenLed: 99.3, youth: 31.9 },
        "vavuniya|maize_cult":     { beneficiaries: 19,   supportValue: 19.0,    womenLed: 31.6, youth: 5.3 },
    };

    const selectedDistricts = ref<string[]>([]);
    const selectedSubCategory = ref<string>("coops");

    const showBeneficiaries = ref(true);
    const showBoundaries = ref(true);

    const statsFor = (districtId: string, subCategoryId: string): Stat => {
        return (
            statsMap[`${districtId}|${subCategoryId}`] ?? {
                beneficiaries: 0,
                supportValue: 0,
                womenLed: 0,
                youth: 0,
            }
        );
    };

    const statsForMultiple = (districtIds: string[], subCategoryId: string): Stat => {
        if (!districtIds.length) {
            districtIds = districts.map((d) => d.id);
        }

        let totalB = 0;
        let totalS = 0;
        let weightedWomen = 0;
        let weightedYouth = 0;

        districtIds.forEach((dId) => {
            const s = statsFor(dId, subCategoryId);
            if (!s.beneficiaries) return;
            totalB += s.beneficiaries;
            totalS += s.supportValue;
            weightedWomen += (s.womenLed / 100) * s.beneficiaries;
            weightedYouth += (s.youth / 100) * s.beneficiaries;
        });

        if (!totalB) {
            return { beneficiaries: 0, supportValue: 0, womenLed: 0, youth: 0 };
        }

        return {
            beneficiaries: totalB,
            supportValue: +totalS.toFixed(1),
            womenLed: +((weightedWomen / totalB) * 100).toFixed(1),
            youth: +((weightedYouth / totalB) * 100).toFixed(1),
        };
    };

    const currentStats = computed<Stat>(() => {
        return statsForMultiple(selectedDistricts.value, selectedSubCategory.value);
    });

    return {
        districts,
        subCategories,
        selectedDistricts,
        selectedSubCategory,
        showBeneficiaries,
        showBoundaries,
        statsFor,
        statsForMultiple,
        currentStats,
    };
}
