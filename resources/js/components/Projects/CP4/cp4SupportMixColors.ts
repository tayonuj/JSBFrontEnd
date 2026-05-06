type ProjectInputOption = {
  id: string;
  label: string;
};

type District = {
  id: string;
};

type StatsForFn = (
  districtId: string,
  projectInputId?: string,
  genderId?: string,
  systemHpId?: string
) => {
  beneficiaries: number;
};

export const CP4_SUPPORT_MIX_PALETTE = [
  0x166534,
  0x15803d,
  0x16a34a,
  0x22c55e,
  0x65a30d,
  0x3f6212,
  0x047857,
];

export const cp4PaletteHex = (index: number) =>
  `#${CP4_SUPPORT_MIX_PALETTE[index % CP4_SUPPORT_MIX_PALETTE.length]
    .toString(16)
    .padStart(6, "0")}`;

export const getCP4SupportMixColorMap = ({
  projectInputOptions,
  selectedProjectInput,
  selectedDistricts,
  districts,
  selectedGender,
  selectedSystemHp,
  statsFor,
}: {
  projectInputOptions: ProjectInputOption[];
  selectedProjectInput: string;
  selectedDistricts: string[];
  districts: District[];
  selectedGender: string;
  selectedSystemHp: string;
  statsFor: StatsForFn;
}) => {
  const targetDistrictIds = selectedDistricts.length
    ? selectedDistricts
    : districts.map((district) => district.id);

  const activeOptions =
    selectedProjectInput === "all"
      ? projectInputOptions
      : projectInputOptions.filter((option) => option.id === selectedProjectInput);

  const visibleOptions = activeOptions.filter((option) => {
    const total = targetDistrictIds.reduce((sum, districtId) => {
      const stat = statsFor(
        districtId,
        option.id,
        selectedGender,
        option.id === "solaririgation" ? selectedSystemHp : "all"
      );

      return sum + (stat?.beneficiaries || 0);
    }, 0);

    return total > 0;
  });

  return Object.fromEntries(
    visibleOptions.map((option, index) => [option.id, cp4PaletteHex(index)])
  ) as Record<string, string>;
};
