import _ from "lodash";
import $ from "jquery";

const refactorGeometrytoGeoJSON = (dataset)=>{
    let feature_array = [];
    let type = null;
    $.each(dataset,function (key,value) {
        let property = null;
        if (value.properties)
             property = value.properties
        else
            property = _.omit(value,['geometry'])

        if (value.geometry && value.geometry.coordinates) {
            feature_array.push({type: "Feature", properties: property, geometry: value.geometry})
            type = value.geometry.type;
        }

    })

    return{
        type: "FeatureCollection",
        name: "district",
        crs: { "type": type, "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84"} },
        features:feature_array
    }
}
export default refactorGeometrytoGeoJSON;
