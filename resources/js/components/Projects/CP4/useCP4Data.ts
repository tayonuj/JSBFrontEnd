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
    { districtId: "kilinochchi", projectInputId: "all", genderId: "all", systemHpId: "all", beneficiaries: 100, youthCount: 7, femaleCount: 99 },
    { districtId: "kilinochchi", projectInputId: "all", genderId: "female", systemHpId: "all", beneficiaries: 100, youthCount: 7, femaleCount: 99 },
    { districtId: "kilinochchi", projectInputId: "solaririgation", genderId: "all", systemHpId: "all", beneficiaries: 100, youthCount: 7, femaleCount: 99 },
    { districtId: "kilinochchi", projectInputId: "solaririgation", genderId: "all", systemHpId: "1hp", beneficiaries: 49, youthCount: 4, femaleCount: 49 },
    { districtId: "kilinochchi", projectInputId: "solaririgation", genderId: "all", systemHpId: "2hp", beneficiaries: 50, youthCount: 3, femaleCount: 50 },
    { districtId: "kilinochchi", projectInputId: "solaririgation", genderId: "female", systemHpId: "all", beneficiaries: 99, youthCount: 7, femaleCount: 99 },
    { districtId: "kilinochchi", projectInputId: "solaririgation", genderId: "female", systemHpId: "1hp", beneficiaries: 49, youthCount: 4, femaleCount: 49 },
    { districtId: "kilinochchi", projectInputId: "solaririgation", genderId: "female", systemHpId: "2hp", beneficiaries: 50, youthCount: 3, femaleCount: 50 },
    { districtId: "nuwara_eliya", projectInputId: "all", genderId: "all", systemHpId: "all", beneficiaries: 513, youthCount: 188, femaleCount: 484 },
    { districtId: "nuwara_eliya", projectInputId: "all", genderId: "female", systemHpId: "all", beneficiaries: 484, youthCount: 184, femaleCount: 484 },
    { districtId: "nuwara_eliya", projectInputId: "all", genderId: "male", systemHpId: "all", beneficiaries: 29, youthCount: 4, femaleCount: 0 },
    { districtId: "nuwara_eliya", projectInputId: "cookstove", genderId: "all", systemHpId: "all", beneficiaries: 200, youthCount: 113, femaleCount: 174 },
    { districtId: "nuwara_eliya", projectInputId: "cookstove", genderId: "female", systemHpId: "all", beneficiaries: 174, youthCount: 109, femaleCount: 174 },
    { districtId: "nuwara_eliya", projectInputId: "cookstove", genderId: "male", systemHpId: "all", beneficiaries: 26, youthCount: 4, femaleCount: 0 },
    { districtId: "nuwara_eliya", projectInputId: "insectproofnet", genderId: "all", systemHpId: "all", beneficiaries: 105, youthCount: 18, femaleCount: 102 },
    { districtId: "nuwara_eliya", projectInputId: "insectproofnet", genderId: "female", systemHpId: "all", beneficiaries: 102, youthCount: 18, femaleCount: 102 },
    { districtId: "nuwara_eliya", projectInputId: "insectproofnet", genderId: "male", systemHpId: "all", beneficiaries: 3, youthCount: 0, femaleCount: 0 },
    { districtId: "nuwara_eliya", projectInputId: "poultry", genderId: "all", systemHpId: "all", beneficiaries: 100, youthCount: 27, femaleCount: 100 },
    { districtId: "nuwara_eliya", projectInputId: "poultry", genderId: "female", systemHpId: "all", beneficiaries: 100, youthCount: 27, femaleCount: 100 },
    { districtId: "nuwara_eliya", projectInputId: "rooftopsolar", genderId: "all", systemHpId: "all", beneficiaries: 108, youthCount: 30, femaleCount: 108 },
    { districtId: "nuwara_eliya", projectInputId: "rooftopsolar", genderId: "female", systemHpId: "all", beneficiaries: 108, youthCount: 30, femaleCount: 108 },
];

export function useCP4Data() {
    const districts = [
        { id: "nuwara_eliya", name: "Nuwara Eliya", lat: 7.121331, lng: 80.749128 },
        { id: "kilinochchi", name: "Kilinochchi", lat: 9.4246229378, lng: 80.3937666654 },
    ];

    const projectInputOptions: Option[] = [
        { id: "poultry", label: "Poultry" },
        { id: "cookstove", label: "Cookstove" },
        { id: "insectproofnet", label: "Incestproof Net" },
        { id: "rooftopsolar", label: "Rooftop Solar" },
        { id: "solaririgation", label: "Solar Irrigation" },
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
            selectedProjectInput.value === "solaririgation"
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
            projectInputId === "solaririgation" &&
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
