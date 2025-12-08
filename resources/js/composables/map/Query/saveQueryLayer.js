const saveQueryLayer = async (json, layerName) => {
    let formData = new FormData();
    formData.append("uid", null);
    formData.append("layername", layerName);
    formData.append("jsonData", JSON.stringify(json));
    try {
        const response = await axios.post('/api/v1/query-layers/save', formData);
        console.log("query layer saved", response.data);
        return  response.data
    } catch (error) {
        if (error.response && error.response.status === 401) {

        }

        console.error("Error in saving layer:", error);
        return error;
    }


};

export default saveQueryLayer;
