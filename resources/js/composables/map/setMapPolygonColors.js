import _ from "lodash";

const setMapColors = (layer,color_array,requested_boundary_type)=> {
    console.log("triggured colors", color_array)
    let property = null;
    switch (requested_boundary_type) {
        case 'District' :
            property = 'District';
            break;
        case 'DSD' :
            property = 'DS_divisio';
            break;
        case 'GND' :
            property = 'GND_N';
            break;
    }
    layer.data.forEach(function (feature) {
        if (property) {
            let color = _.find(color_array, o => o.chartLabelx.toLowerCase() === feature.getProperty(property).toLowerCase())
            if (color) {
                layer.data.overrideStyle(feature, {
                    strokeColor: color.color,
                    fillColor: color.color,
                    fillOpacity: 0.8
                });
            } else {
                layer.data.overrideStyle(feature, {
                    strokeColor: '#000',
                    fillOpacity: 0
                });
            }
        }
    })

}
export default setMapColors
