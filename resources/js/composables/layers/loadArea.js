// useArea.js

import generalAxiosRequest from "../application/generalAxiosRequest";
import $ from 'jquery';
const loadArea = async (existing_level, selected_value, requesting_level,$loading) => {

    if (!$.isArray(selected_value)) {
        selected_value = [selected_value];
    }

    const payload = {
        url: 'https://services.gsentry.cloud/api/v1/admin-boundary/list',
        data: JSON.stringify({
            collection: 'ci_db_2021',
            existing_values: JSON.stringify(selected_value),
            existing_level: existing_level,
            requesting_level: requesting_level,
        })
    }
    const {json_data} = await generalAxiosRequest('curl-requests/post', payload,false,$loading);
    // console.log('Admin data', json_data.value);

    const results = {
        selected_boundary_type: existing_level,
        selected_boundary_value: selected_value,
        requested_boundary_type: requesting_level,
    };

    switch (requesting_level) {
        case 'province':
            results.province_list = json_data.value;
            break;
        case 'district':
            results.district_list = json_data.value;
            break;
        case 'dsd':
            results.dsd_list = json_data.value;
            break;
        case 'gnd':
            results.gnd_list = json_data.value;
            break;
        case 'asc':
            results.asc_list = json_data.value;
            break;
        case 'electorate':
            results.electorate_list = json_data.value;
            break;
        case 'postal_code':
            results.postal_code_list = json_data.value;
            break;
    }
    results.requested_boundary_values = json_data.value;
    return results;
}
export default loadArea;
