import { ref, computed } from "vue";

type Stat = {
    beneficiaries: number;
    supportValue: number;
    womenLed: number;
    youth: number;
};

type SubCategoryOption = {
    id: string;
    label: string;
    values: string[];
};

type SubCategory = {
    id: string;
    label: string;
    column: string;
    options: SubCategoryOption[];
};

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

    const subCategories: SubCategory[] = [
        {
            id: "gender",
            label: "Gender",
            column: "Gender",
            options: [
                { id: "male", label: "Male", values: ["Male"] },
                { id: "female", label: "Female", values: ["Female", "female"] },
            ],
        },
        {
            id: "type_of_residency",
            label: "Type of Residency",
            column: "Type of Re",
            options: [
                { id: "permanent", label: "Permanent", values: ["Permanent"] },
                { id: "other", label: "Other", values: ["Other"] },
            ],
        },
        {
            id: "land_availability",
            label: "Land Availability",
            column: "Land avail",
            options: [
                {
                    id: "land_10p_to_quarter",
                    label: "10 perched to 1/4 acre",
                    values: ["Equal or above 10 perched and less than 1/4 acres"],
                },
                {
                    id: "land_quarter_to_half",
                    label: "1/4 acre to 1/2 acre",
                    values: ["Equal or above 1/4 acres and less than 1/2 acres"],
                },
                {
                    id: "land_above_half",
                    label: "Above 1/2 acre",
                    values: ["above 1/2 acres"],
                },
            ],
        },
        {
            id: "year_round_water",
            label: "Year-round Water",
            column: "Year-round",
            options: [
                { id: "high", label: "High", values: ["High"] },
                { id: "medium", label: "Medium", values: ["Medium"] },
                { id: "no", label: "No", values: ["No"] },
            ],
        },
        {
            id: "micro_irrigation",
            label: "Micro Irrigation",
            column: "Availabili",
            options: [
                { id: "yes", label: "Yes", values: ["Yes", "yes"] },
                { id: "no", label: "No", values: ["No", "no"] },
            ],
        },
        {
            id: "motor_availability",
            label: "Motor Availability",
            column: "Availabi_1",
            options: [{ id: "yes", label: "Yes", values: ["Yes", "yes"] }],
        },
        {
            id: "jsb",
            label: "JSB",
            column: "JSB",
            options: [
                { id: "yes", label: "Yes", values: ["Yes", "yes"] },
                { id: "no", label: "No", values: ["No", "no"] },
            ],
        },
        {
            id: "roof_type",
            label: "Roof Type",
            column: "Roof type",
            options: [
                {
                    id: "clay_roof_tiles",
                    label: "Clay Roof Tiles",
                    values: ["Clay Roof Tiles"],
                },
                {
                    id: "asbestos_sheets",
                    label: "Asbestos Sheets",
                    values: ["Asbestos Sheets"],
                },
            ],
        },
    ];

    const statsMap: Record<string, Stat> = {
        "mullaitivu:gender": { beneficiaries: 100, supportValue: 100.0, womenLed: 67.0, youth: 18.0 },
        "mullaitivu:type_of_residency": { beneficiaries: 100, supportValue: 100.0, womenLed: 67.0, youth: 18.0 },
        "mullaitivu:land_availability": { beneficiaries: 100, supportValue: 100.0, womenLed: 67.0, youth: 18.0 },
        "mullaitivu:year_round_water": { beneficiaries: 100, supportValue: 100.0, womenLed: 67.0, youth: 18.0 },
        "mullaitivu:micro_irrigation": { beneficiaries: 100, supportValue: 100.0, womenLed: 67.0, youth: 18.0 },
        "mullaitivu:motor_availability": { beneficiaries: 100, supportValue: 100.0, womenLed: 67.0, youth: 18.0 },
        "mullaitivu:jsb": { beneficiaries: 100, supportValue: 100.0, womenLed: 67.0, youth: 18.0 },
        "mullaitivu:roof_type": { beneficiaries: 100, supportValue: 100.0, womenLed: 67.0, youth: 18.0 },
    };

    const selectedDistricts = ref<string[]>(["mullaitivu"]);
    const selectedSubCategory = ref<string>("gender");
    const selectedSubCategoryOption = ref<string>("");

    const showBeneficiaries = ref(true);
    const showBoundaries = ref(true);

    const currentSubCategory = computed(() => {
        return subCategories.find((c) => c.id === selectedSubCategory.value) ?? subCategories[0];
    });

    const statsFor = (districtId: string, subCategoryId: string): Stat => {
        return (
            statsMap[`${districtId}:${subCategoryId}`] ?? {
                beneficiaries: 0,
                supportValue: 0,
                womenLed: 0,
                youth: 0,
            }
        );
    };

    const statsForMultiple = (districtIds: string[], subCategoryId: string): Stat => {
        const ids = districtIds.length ? districtIds : districts.map((d) => d.id);

        let totalB = 0;
        let totalS = 0;
        let weightedWomen = 0;
        let weightedYouth = 0;

        ids.forEach((dId) => {
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
        dsDivisions,
        subCategories,
        selectedDistricts,
        selectedSubCategory,
        selectedSubCategoryOption,
        currentSubCategory,
        showBeneficiaries,
        showBoundaries,
        statsFor,
        statsForMultiple,
        currentStats,
    };
}
