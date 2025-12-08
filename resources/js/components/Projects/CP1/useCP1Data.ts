import { ref, computed } from "vue";

export function useCP1Data() {
    const districts = [
        { id: "anuradhapura", name: "Anuradhapura", lat: 8.335, lng: 80.41 },
        { id: "polonnaruwa", name: "Polonnaruwa", lat: 7.939, lng: 81.003 },
        { id: "trincomalee", name: "Trincomalee", lat: 8.587, lng: 81.215 },
    ];

    const subCategories = [
        { id: "hens", label: "Distribution of hens" },
        { id: "feed", label: "Chicken feed support" },
        { id: "housing", label: "Coop / housing" },
    ];

    const statsMap: any = {
        "anuradhapura|hens": { beneficiaries: 180, supportValue: 5_000_000, womenLed: 62, youth: 38 },
        "anuradhapura|feed": { beneficiaries: 120, supportValue: 3_200_000, womenLed: 55, youth: 42 },
        "anuradhapura|housing": { beneficiaries: 80, supportValue: 2_000_000, womenLed: 50, youth: 35 },

        "polonnaruwa|hens": { beneficiaries: 140, supportValue: 4_100_000, womenLed: 48, youth: 33 },
        "polonnaruwa|feed": { beneficiaries: 90, supportValue: 2_500_000, womenLed: 52, youth: 37 },
        "polonnaruwa|housing": { beneficiaries: 60, supportValue: 1_600_000, womenLed: 47, youth: 30 },

        "trincomalee|hens": { beneficiaries: 160, supportValue: 4_800_000, womenLed: 58, youth: 40 },
        "trincomalee|feed": { beneficiaries: 110, supportValue: 3_000_000, womenLed: 60, youth: 44 },
        "trincomalee|housing": { beneficiaries: 70, supportValue: 1_900_000, womenLed: 53, youth: 32 },
    };

    const selectedDistrict = ref("anuradhapura");
    const selectedSubCategory = ref("hens");

    const showBeneficiaries = ref(true);
    const showBoundaries = ref(true);

    const statsFor = (districtId: string, subCategoryId: string) => {
        return statsMap[`${districtId}|${subCategoryId}`] ?? { beneficiaries: 0, supportValue: 0 };
    };

// useCP1Data.ts
    const currentStats = computed(() => {
        const dId = selectedDistrict.value;
        const cId = selectedSubCategory.value;

        const st = statsFor(dId, cId);
        if (!st.beneficiaries) {
            return { beneficiaries: 0, supportValue: 0, womenLed: 0, youth: 0 };
        }

        return {
            beneficiaries: st.beneficiaries,
            supportValue: st.supportValue,
            womenLed: st.womenLed,
            youth: st.youth
        };
    });


    return {
        districts,
        subCategories,
        selectedDistrict,
        selectedSubCategory,
        showBeneficiaries,
        showBoundaries,
        statsFor,
        currentStats
    };
}
