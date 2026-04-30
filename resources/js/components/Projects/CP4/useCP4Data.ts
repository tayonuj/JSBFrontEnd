import { computed, ref, watch } from "vue";

type Stat = {
    beneficiaries: number;
    supportValue: number;
    womenLed: number;
    youth: number;
};

type Option = {
    id: string;
    label: string;
};

type SummaryRow = {
    districtId: string;
    projectInputId: string;
    genderId: string;
    systemHpId: string;
    beneficiaries: number;
    youthCount: number;
    femaleCount: number;
};

const summaryRows: SummaryRow[] = [
    { districtId: "kilinochchi", projectInputId: "all", genderId: "all", systemHpId: "1hp", beneficiaries: 49, youthCount: 4, femaleCount: 49 },
    { districtId: "kilinochchi", projectInputId: "all", genderId: "all", systemHpId: "2hp", beneficiaries: 50, youthCount: 3, femaleCount: 50 },
    { districtId: "kilinochchi", projectInputId: "all", genderId: "all", systemHpId: "all", beneficiaries: 99, youthCount: 7, femaleCount: 99 },
    { districtId: "kilinochchi", projectInputId: "all", genderId: "female", systemHpId: "all", beneficiaries: 99, youthCount: 7, femaleCount: 99 },
    { districtId: "kilinochchi", projectInputId: "solar", genderId: "all", systemHpId: "1hp", beneficiaries: 49, youthCount: 4, femaleCount: 49 },
    { districtId: "kilinochchi", projectInputId: "solar", genderId: "all", systemHpId: "2hp", beneficiaries: 50, youthCount: 3, femaleCount: 50 },
    { districtId: "kilinochchi", projectInputId: "solar", genderId: "all", systemHpId: "all", beneficiaries: 99, youthCount: 7, femaleCount: 99 },
    { districtId: "kilinochchi", projectInputId: "solar", genderId: "female", systemHpId: "1hp", beneficiaries: 49, youthCount: 4, femaleCount: 49 },
    { districtId: "kilinochchi", projectInputId: "solar", genderId: "female", systemHpId: "2hp", beneficiaries: 50, youthCount: 3, femaleCount: 50 },
    { districtId: "kilinochchi", projectInputId: "solar", genderId: "female", systemHpId: "all", beneficiaries: 99, youthCount: 7, femaleCount: 99 },
    { districtId: "nuwara_eliya", projectInputId: "all", genderId: "all", systemHpId: "all", beneficiaries: 481, youthCount: 167, femaleCount: 447 },
    { districtId: "nuwara_eliya", projectInputId: "all", genderId: "female", systemHpId: "all", beneficiaries: 447, youthCount: 162, femaleCount: 447 },
    { districtId: "nuwara_eliya", projectInputId: "all", genderId: "male", systemHpId: "all", beneficiaries: 34, youthCount: 5, femaleCount: 0 },
    { districtId: "nuwara_eliya", projectInputId: "cookstove", genderId: "all", systemHpId: "all", beneficiaries: 194, youthCount: 113, femaleCount: 168 },
    { districtId: "nuwara_eliya", projectInputId: "cookstove", genderId: "female", systemHpId: "all", beneficiaries: 168, youthCount: 109, femaleCount: 168 },
    { districtId: "nuwara_eliya", projectInputId: "cookstove", genderId: "male", systemHpId: "all", beneficiaries: 26, youthCount: 4, femaleCount: 0 },
    { districtId: "nuwara_eliya", projectInputId: "cookstove_insectproofnet", genderId: "all", systemHpId: "all", beneficiaries: 6, youthCount: 0, femaleCount: 6 },
    { districtId: "nuwara_eliya", projectInputId: "cookstove_insectproofnet", genderId: "female", systemHpId: "all", beneficiaries: 6, youthCount: 0, femaleCount: 6 },
    { districtId: "nuwara_eliya", projectInputId: "insectproofnet", genderId: "all", systemHpId: "all", beneficiaries: 105, youthCount: 18, femaleCount: 102 },
    { districtId: "nuwara_eliya", projectInputId: "insectproofnet", genderId: "female", systemHpId: "all", beneficiaries: 102, youthCount: 18, femaleCount: 102 },
    { districtId: "nuwara_eliya", projectInputId: "insectproofnet", genderId: "male", systemHpId: "all", beneficiaries: 3, youthCount: 0, femaleCount: 0 },
    { districtId: "nuwara_eliya", projectInputId: "poultry", genderId: "all", systemHpId: "all", beneficiaries: 91, youthCount: 26, femaleCount: 91 },
    { districtId: "nuwara_eliya", projectInputId: "poultry", genderId: "female", systemHpId: "all", beneficiaries: 91, youthCount: 26, femaleCount: 91 },
    { districtId: "nuwara_eliya", projectInputId: "poultry_insectproofnet", genderId: "all", systemHpId: "all", beneficiaries: 9, youthCount: 1, femaleCount: 9 },
    { districtId: "nuwara_eliya", projectInputId: "poultry_insectproofnet", genderId: "female", systemHpId: "all", beneficiaries: 9, youthCount: 1, femaleCount: 9 },
    { districtId: "nuwara_eliya", projectInputId: "solar", genderId: "all", systemHpId: "all", beneficiaries: 76, youthCount: 9, femaleCount: 71 },
    { districtId: "nuwara_eliya", projectInputId: "solar", genderId: "female", systemHpId: "all", beneficiaries: 71, youthCount: 8, femaleCount: 71 },
    { districtId: "nuwara_eliya", projectInputId: "solar", genderId: "male", systemHpId: "all", beneficiaries: 5, youthCount: 1, femaleCount: 0 },
];

export function useCP4Data() {
    const districts = [
        { id: "nuwara_eliya", name: "Nuwara Eliya", lat: 7.121331, lng: 80.749128 },
        { id: "kilinochchi", name: "Kilinochchi", lat: 9.4246229378, lng: 80.3937666654 },
    ];

    const projectInputOptions: Option[] = [
        { id: "poultry", label: "Poultry" },
        { id: "poultry_insectproofnet", label: "Poultry and Insectproofnet" },
        { id: "cookstove", label: "Cookstove" },
        { id: "solar", label: "Solar" },
        { id: "cookstove_insectproofnet", label: "Cookstove and Insectproofnet" },
        { id: "insectproofnet", label: "Insectproofnet" },
    ];

    const genderOptions: Option[] = [
        { id: "all", label: "All" },
        { id: "male", label: "Male" },
        { id: "female", label: "Female" },
    ];

    const systemHpOptions: Option[] = [
        { id: "all", label: "All" },
        { id: "1hp", label: "1 HP" },
        { id: "2hp", label: "2 HP" },
    ];

    const selectedDistricts = ref<string[]>([]);
    const selectedProjectInput = ref<string>("all");
    const selectedGender = ref<string>("all");
    const selectedSystemHp = ref<string>("all");

    const showBeneficiaries = ref(true);
    const showBoundaries = ref(true);

    const showSystemHpFilter = computed(() => {
        return (
            selectedDistricts.value.length === 1 &&
            selectedDistricts.value[0] === "kilinochchi" &&
            selectedProjectInput.value === "solar"
        );
    });

    watch(showSystemHpFilter, (visible) => {
        if (!visible) {
            selectedSystemHp.value = "all";
        }
    });

    const getEffectiveSystemHp = (
        districtId: string,
        projectInputId: string,
        systemHpId: string
    ) => {
        if (
            districtId === "kilinochchi" &&
            projectInputId === "solar" &&
            systemHpId !== "all"
        ) {
            return systemHpId;
        }

        return "all";
    };

    const statsFor = (
        districtId: string,
        projectInputId = "all",
        genderId = "all",
        systemHpId = "all"
    ): Stat => {
        const effectiveSystemHp = getEffectiveSystemHp(
            districtId,
            projectInputId,
            systemHpId
        );

        const match = summaryRows.find(
            (row) =>
                row.districtId === districtId &&
                row.projectInputId === projectInputId &&
                row.genderId === genderId &&
                row.systemHpId === effectiveSystemHp
        );

        if (!match || !match.beneficiaries) {
            return {
                beneficiaries: 0,
                supportValue: 0,
                womenLed: 0,
                youth: 0,
            };
        }

        return {
            beneficiaries: match.beneficiaries,
            supportValue: match.beneficiaries,
            womenLed: +((match.femaleCount / match.beneficiaries) * 100).toFixed(1),
            youth: +((match.youthCount / match.beneficiaries) * 100).toFixed(1),
        };
    };

    const statsForMultiple = (
        districtIds: string[],
        projectInputId = "all",
        genderId = "all",
        systemHpId = "all"
    ): Stat => {
        const ids = districtIds.length ? districtIds : districts.map((district) => district.id);

        let totalBeneficiaries = 0;
        let totalSupportValue = 0;
        let weightedWomen = 0;
        let weightedYouth = 0;

        ids.forEach((districtId) => {
            const stat = statsFor(
                districtId,
                projectInputId,
                genderId,
                systemHpId
            );

            if (!stat.beneficiaries) return;

            totalBeneficiaries += stat.beneficiaries;
            totalSupportValue += stat.supportValue;
            weightedWomen += (stat.womenLed / 100) * stat.beneficiaries;
            weightedYouth += (stat.youth / 100) * stat.beneficiaries;
        });

        if (!totalBeneficiaries) {
            return {
                beneficiaries: 0,
                supportValue: 0,
                womenLed: 0,
                youth: 0,
            };
        }

        return {
            beneficiaries: totalBeneficiaries,
            supportValue: +totalSupportValue.toFixed(1),
            womenLed: +((weightedWomen / totalBeneficiaries) * 100).toFixed(1),
            youth: +((weightedYouth / totalBeneficiaries) * 100).toFixed(1),
        };
    };

    const currentStats = computed<Stat>(() =>
        statsForMultiple(
            selectedDistricts.value,
            selectedProjectInput.value,
            selectedGender.value,
            selectedSystemHp.value
        )
    );

    return {
        districts,
        projectInputOptions,
        genderOptions,
        systemHpOptions,
        selectedDistricts,
        selectedProjectInput,
        selectedGender,
        selectedSystemHp,
        showSystemHpFilter,
        showBeneficiaries,
        showBoundaries,
        statsFor,
        statsForMultiple,
        currentStats,
    };
}
