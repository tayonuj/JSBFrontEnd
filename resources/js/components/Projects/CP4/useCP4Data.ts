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

export function useCP4Data() {
    const districts = [
        {
            id: "nuwara_eliya",
            name: "Nuwara Eliya",
            lat: 7.121331,
            lng: 80.749128,
        },
    ];

    const dsDivisions = [
        {
            id: "hanguranketha",
            name: "Hanguranketha",
            count: 481,
            lat: 7.121331,
            lng: 80.749128,
        },
    ];

    const subCategories: SubCategory[] = [
        {
            id: "gender",
            label: "Gender",
            column: "Gender",
            options: [
                { id: "male", label: "Male", values: ["Male"] },
                { id: "female", label: "Female", values: ["Female"] },
            ],
        },
        {
            id: "type_of_family",
            label: "Type of Family",
            column: "Type_of_Fa",
            options: [
                { id: "individual", label: "Individual", values: ["Individual"] },
                { id: "micro", label: "Micro", values: ["Micro"] },
                { id: "smes", label: "SME's", values: ["SME's"] },
            ],
        },
        {
            id: "land_ownership",
            label: "Land Ownership",
            column: "Land_Owner",
            options: [
                { id: "yes", label: "Yes", values: ["Yes"] },
                { id: "no", label: "No", values: ["No", "no"] },
            ],
        },
        {
            id: "electricity_at_home",
            label: "Electricity at Home",
            column: "Electricit",
            options: [
                { id: "yes", label: "Yes", values: ["Yes"] },
                { id: "no", label: "No", values: ["No"] },
            ],
        },
        {
            id: "capacity",
            label: "Capacity",
            column: "Capacity",
            options: [
                {
                    id: "single_phase",
                    label: "Single Phase",
                    values: ["Single Phase", "Single phase"],
                },
                {
                    id: "three_phase_singal",
                    label: "Three Phase / Singal",
                    values: ["Three Phase/ Singal"],
                },
                {
                    id: "no",
                    label: "No",
                    values: ["No"],
                },
            ],
        },
        {
            id: "estate_worker_family",
            label: "Estate Worker Family",
            column: "Estate_wor",
            options: [
                { id: "yes", label: "Yes", values: ["Yes"] },
                { id: "no", label: "No", values: ["No"] },
            ],
        },
        {
            id: "roof_type",
            label: "Roof Type",
            column: "Roof_Type_",
            options: [
                {
                    id: "metal_sheet",
                    label: "Metal / Sheet Roof",
                    values: [
                        "Metal Sheet Roofs",
                        "Amano",
                        "Amano sheet",
                        "Rofing sheet",
                        "Sheet",
                        "Sheets",
                        "Shett",
                        "Tin",
                        "sheet",
                    ],
                },
                {
                    id: "asbestos_sheet",
                    label: "Asbestos Roof",
                    values: [
                        "Asbestos",
                        "Asbestos Sheet",
                        "Asbestos Sheet Roofs",
                        "AsbestosRoofing",
                        "asbestos",
                    ],
                },
                {
                    id: "tile_roof",
                    label: "Tile Roof",
                    values: ["Clay Tile Roofs", "Roofing tiles"],
                },
                {
                    id: "concrete_slab",
                    label: "Concrete / Slab",
                    values: [
                        "Concrete",
                        "Concrete Slab Roofs",
                        "Concreet",
                        "Slab",
                        "Tile / concreet",
                    ],
                },
            ],
        },
        {
            id: "roof_condition",
            label: "Roof Condition",
            column: "Roof_Condi",
            options: [
                { id: "good", label: "Good", values: ["Good"] },
                { id: "average", label: "Average", values: ["Average"] },
                { id: "poor", label: "Poor", values: ["Poor"] },
            ],
        },
        {
            id: "available_livestock",
            label: "Available Livestock",
            column: "Available_",
            options: [
                { id: "poultry", label: "Poultry", values: ["Poultry"] },
                { id: "cattle", label: "Cattle", values: ["Cattle"] },
                { id: "both", label: "Both", values: ["Both"] },
                { id: "other", label: "Other", values: ["anyother"] },
                { id: "no", label: "No", values: ["No"] },
            ],
        },
        {
            id: "space_availability",
            label: "Space Availability",
            column: "Space_avai",
            options: [
                { id: "yes", label: "Yes", values: ["Yes"] },
                { id: "no", label: "No / 0", values: ["No", "0"] },
                { id: "partial", label: "Partial / Average", values: ["No/Yes", "Average"] },
            ],
        },
        {
            id: "home_type",
            label: "Home Type",
            column: "Individual",
            options: [
                {
                    id: "individual_room",
                    label: "Individual Room",
                    values: ["Individual Room", "Individual", "Individual  no need", "Individula"],
                },
                {
                    id: "layan_room",
                    label: "Layan Room",
                    values: ["Layan Room", "Layan", "Layam"],
                },
                {
                    id: "other",
                    label: "Other / TC",
                    values: ["other", "TC"],
                },
            ],
        },
        {
            id: "coockstove_other_project",
            label: "Cookstove from Other Project",
            column: "Coockstove",
            options: [
                { id: "yes", label: "Yes", values: ["Yes"] },
                { id: "no", label: "No", values: ["No"] },
            ],
        },
        {
            id: "project_inputs",
            label: "Project Inputs",
            column: "Project_In",
            options: [
                { id: "cookstove", label: "Cookstove", values: ["Cookstove"] },
                { id: "poultry", label: "Poultry", values: ["Poultry"] },
                { id: "solar", label: "Solar", values: ["Solar"] },
                {
                    id: "insect_proof_net",
                    label: "Insect Proof Net",
                    values: [
                        "Insect Proof Net",
                        "Insectproof Net",
                        "Insecproof Net",
                        "Insect Proof  Net",
                    ],
                },
                {
                    id: "poultry_and_insectproof_net",
                    label: "Poultry + Insectproof Net",
                    values: ["Poultry and Insectproof Net"],
                },
                {
                    id: "cookstove_and_insectproof_net",
                    label: "Cookstove + Insectproof Net",
                    values: ["Cookstove and Insect  proof Net"],
                },
            ],
        },
        {
            id: "distribution_status",
            label: "Distribution Status",
            column: "Status_of_",
            options: [
                { id: "distributed", label: "Distributed", values: ["Distributed"] },
                { id: "completed", label: "Completed", values: ["Completed"] },
                {
                    id: "yet_not_completed",
                    label: "Yet Not Completed",
                    values: ["Yet Not Completed"],
                },
                {
                    id: "insect_proof_net",
                    label: "Insect Proof Net",
                    values: ["Insect Proof Net", "Insectproof Net"],
                },
            ],
        },
    ];

    const selectedDistricts = ref<string[]>(["nuwara_eliya"]);
    const selectedSubCategory = ref<string>("gender");
    const selectedSubCategoryOption = ref<string>("");

    const showBeneficiaries = ref(true);
    const showBoundaries = ref(true);

    const currentSubCategory = computed(() => {
        return subCategories.find((c) => c.id === selectedSubCategory.value) ?? subCategories[0];
    });

    const currentOption = computed(() => {
        return (
            currentSubCategory.value.options.find(
                (o) => o.id === selectedSubCategoryOption.value
            ) ?? null
        );
    });

    // OPTION-LEVEL stats
    const statsMap: Record<string, Stat> = {
        "nuwara_eliya:gender:male": {
            beneficiaries: 34,
            supportValue: 34.0,
            womenLed: 0.0,
            youth: 26.5,
        },
        "nuwara_eliya:gender:female": {
            beneficiaries: 447,
            supportValue: 447.0,
            womenLed: 100.0,
            youth: 35.6,
        },

        "nuwara_eliya:roof_condition:good": {
            beneficiaries: 232,
            supportValue: 232.0,
            womenLed: 93.5,
            youth: 34.9,
        },
        "nuwara_eliya:roof_condition:average": {
            beneficiaries: 161,
            supportValue: 161.0,
            womenLed: 92.5,
            youth: 34.2,
        },
        "nuwara_eliya:roof_condition:poor": {
            beneficiaries: 88,
            supportValue: 88.0,
            womenLed: 91.0,
            youth: 36.4,
        },

        "nuwara_eliya:land_ownership:yes": {
            beneficiaries: 224,
            supportValue: 224.0,
            womenLed: 92.9,
            youth: 36.6,
        },
        "nuwara_eliya:land_ownership:no": {
            beneficiaries: 257,
            supportValue: 257.0,
            womenLed: 92.6,
            youth: 33.5,
        },

        "nuwara_eliya:electricity_at_home:yes": {
            beneficiaries: 451,
            supportValue: 451.0,
            womenLed: 92.9,
            youth: 34.8,
        },
        "nuwara_eliya:electricity_at_home:no": {
            beneficiaries: 30,
            supportValue: 30.0,
            womenLed: 93.3,
            youth: 36.7,
        },

        "nuwara_eliya:estate_worker_family:yes": {
            beneficiaries: 329,
            supportValue: 329.0,
            womenLed: 93.3,
            youth: 34.3,
        },
        "nuwara_eliya:estate_worker_family:no": {
            beneficiaries: 152,
            supportValue: 152.0,
            womenLed: 92.1,
            youth: 36.2,
        },

        "nuwara_eliya:coockstove_other_project:yes": {
            beneficiaries: 79,
            supportValue: 79.0,
            womenLed: 92.4,
            youth: 34.2,
        },
        "nuwara_eliya:coockstove_other_project:no": {
            beneficiaries: 402,
            supportValue: 402.0,
            womenLed: 92.8,
            youth: 35.1,
        },

        "nuwara_eliya:type_of_family:individual": {
            beneficiaries: 294,
            supportValue: 294.0,
            womenLed: 92.9,
            youth: 34.0,
        },
        "nuwara_eliya:type_of_family:micro": {
            beneficiaries: 184,
            supportValue: 184.0,
            womenLed: 93.5,
            youth: 36.4,
        },
        "nuwara_eliya:type_of_family:smes": {
            beneficiaries: 3,
            supportValue: 3.0,
            womenLed: 66.7,
            youth: 0.0,
        },

        "nuwara_eliya:capacity:single_phase": {
            beneficiaries: 447,
            supportValue: 447.0,
            womenLed: 92.8,
            youth: 35.1,
        },
        "nuwara_eliya:capacity:three_phase_singal": {
            beneficiaries: 3,
            supportValue: 3.0,
            womenLed: 100.0,
            youth: 0.0,
        },
        "nuwara_eliya:capacity:no": {
            beneficiaries: 31,
            supportValue: 31.0,
            womenLed: 93.5,
            youth: 35.5,
        },

        "nuwara_eliya:roof_type:metal_sheet": {
            beneficiaries: 252,
            supportValue: 252.0,
            womenLed: 92.9,
            youth: 35.7,
        },
        "nuwara_eliya:roof_type:asbestos_sheet": {
            beneficiaries: 99,
            supportValue: 99.0,
            womenLed: 94.9,
            youth: 34.3,
        },
        "nuwara_eliya:roof_type:tile_roof": {
            beneficiaries: 34,
            supportValue: 34.0,
            womenLed: 91.2,
            youth: 35.3,
        },
        "nuwara_eliya:roof_type:concrete_slab": {
            beneficiaries: 96,
            supportValue: 96.0,
            womenLed: 90.6,
            youth: 31.3,
        },

        "nuwara_eliya:available_livestock:poultry": {
            beneficiaries: 210,
            supportValue: 210.0,
            womenLed: 92.9,
            youth: 35.7,
        },
        "nuwara_eliya:available_livestock:cattle": {
            beneficiaries: 140,
            supportValue: 140.0,
            womenLed: 92.1,
            youth: 35.7,
        },
        "nuwara_eliya:available_livestock:both": {
            beneficiaries: 7,
            supportValue: 7.0,
            womenLed: 100.0,
            youth: 42.9,
        },
        "nuwara_eliya:available_livestock:other": {
            beneficiaries: 1,
            supportValue: 1.0,
            womenLed: 100.0,
            youth: 0.0,
        },
        "nuwara_eliya:available_livestock:no": {
            beneficiaries: 123,
            supportValue: 123.0,
            womenLed: 93.5,
            youth: 31.7,
        },

        "nuwara_eliya:space_availability:yes": {
            beneficiaries: 393,
            supportValue: 393.0,
            womenLed: 93.1,
            youth: 35.4,
        },
        "nuwara_eliya:space_availability:no": {
            beneficiaries: 34,
            supportValue: 34.0,
            womenLed: 94.1,
            youth: 29.4,
        },
        "nuwara_eliya:space_availability:partial": {
            beneficiaries: 54,
            supportValue: 54.0,
            womenLed: 88.9,
            youth: 33.3,
        },

        "nuwara_eliya:home_type:individual_room": {
            beneficiaries: 318,
            supportValue: 318.0,
            womenLed: 93.7,
            youth: 35.2,
        },
        "nuwara_eliya:home_type:layan_room": {
            beneficiaries: 158,
            supportValue: 158.0,
            womenLed: 91.8,
            youth: 34.2,
        },
        "nuwara_eliya:home_type:other": {
            beneficiaries: 5,
            supportValue: 5.0,
            womenLed: 100.0,
            youth: 20.0,
        },

        "nuwara_eliya:project_inputs:cookstove": {
            beneficiaries: 147,
            supportValue: 147.0,
            womenLed: 93.2,
            youth: 32.7,
        },
        "nuwara_eliya:project_inputs:poultry": {
            beneficiaries: 131,
            supportValue: 131.0,
            womenLed: 94.7,
            youth: 38.2,
        },
        "nuwara_eliya:project_inputs:solar": {
            beneficiaries: 15,
            supportValue: 15.0,
            womenLed: 86.7,
            youth: 13.3,
        },
        "nuwara_eliya:project_inputs:insect_proof_net": {
            beneficiaries: 168,
            supportValue: 168.0,
            womenLed: 91.1,
            youth: 37.5,
        },
        "nuwara_eliya:project_inputs:poultry_and_insectproof_net": {
            beneficiaries: 17,
            supportValue: 17.0,
            womenLed: 94.1,
            youth: 35.3,
        },
        "nuwara_eliya:project_inputs:cookstove_and_insectproof_net": {
            beneficiaries: 3,
            supportValue: 3.0,
            womenLed: 100.0,
            youth: 0.0,
        },

        "nuwara_eliya:distribution_status:distributed": {
            beneficiaries: 226,
            supportValue: 226.0,
            womenLed: 92.0,
            youth: 33.2,
        },
        "nuwara_eliya:distribution_status:completed": {
            beneficiaries: 84,
            supportValue: 84.0,
            womenLed: 95.2,
            youth: 36.9,
        },
        "nuwara_eliya:distribution_status:yet_not_completed": {
            beneficiaries: 166,
            supportValue: 166.0,
            womenLed: 93.4,
            youth: 37.3,
        },
        "nuwara_eliya:distribution_status:insect_proof_net": {
            beneficiaries: 5,
            supportValue: 5.0,
            womenLed: 80.0,
            youth: 20.0,
        },
    };

    const categoryTotalsMap: Record<string, Stat> = {
        "nuwara_eliya:gender": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:type_of_family": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:land_ownership": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:electricity_at_home": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:capacity": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:estate_worker_family": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:roof_type": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:roof_condition": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:available_livestock": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:space_availability": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:home_type": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:coockstove_other_project": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:project_inputs": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
        "nuwara_eliya:distribution_status": {
            beneficiaries: 481,
            supportValue: 481.0,
            womenLed: 92.9,
            youth: 34.9,
        },
    };

    const statsFor = (
        districtId: string,
        subCategoryId: string,
        optionId?: string
    ): Stat => {
        if (optionId) {
            const optionStat = statsMap[`${districtId}:${subCategoryId}:${optionId}`];
            if (optionStat) return optionStat;
        }

        return (
            categoryTotalsMap[`${districtId}:${subCategoryId}`] ?? {
                beneficiaries: 0,
                supportValue: 0,
                womenLed: 0,
                youth: 0,
            }
        );
    };

    const statsForMultiple = (
        districtIds: string[],
        subCategoryId: string,
        optionId?: string
    ): Stat => {
        const ids = districtIds.length ? districtIds : districts.map((d) => d.id);

        let totalB = 0;
        let totalS = 0;
        let weightedWomen = 0;
        let weightedYouth = 0;

        ids.forEach((dId) => {
            const s = statsFor(dId, subCategoryId, optionId);
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
        return statsForMultiple(
            selectedDistricts.value,
            selectedSubCategory.value,
            selectedSubCategoryOption.value || undefined
        );
    });

    return {
        districts,
        dsDivisions,
        subCategories,
        selectedDistricts,
        selectedSubCategory,
        selectedSubCategoryOption,
        currentSubCategory,
        currentOption,
        showBeneficiaries,
        showBoundaries,
        statsFor,
        statsForMultiple,
        currentStats,
    };
}
