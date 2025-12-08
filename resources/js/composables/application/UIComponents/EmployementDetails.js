import { ref } from 'vue';

export function getSubOrganizationCodes(dataset, parentCode) {
    const subOrganizationCodes = ref([]);

    const findSubOrganizations = (data, parentCode) => {
        for (const org of data) {
            if (org.code === parentCode) {
                if (org.subOrganizations && org.subOrganizations.length > 0) {
                    subOrganizationCodes.value = org.subOrganizations.map(subOrg => subOrg.code+"--"+subOrg.name);
                } else {
                    subOrganizationCodes.value = [];
                }
                return;
            } else if (org.subOrganizations && org.subOrganizations.length > 0) {
                findSubOrganizations(org.subOrganizations, parentCode);
            }
        }
    };

    findSubOrganizations(dataset, parentCode);

    return subOrganizationCodes;
}
