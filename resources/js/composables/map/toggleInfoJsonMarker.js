import _ from "lodash";
import $ from "jquery";
import {ref} from "vue";

const toggleInfoJsonMarker = (lat,lng,data) => {
    const infoContent = ref("");
    const infoPosition = ref({});

    data = _.omit(data,['created_at','updated_at','icon','paths'
        ,'coordinates','FID','OBJECTID','Shape_Le_1','key','layer','color','id','lid','_id']);
    data = _.pickBy(data, _.identity);

     infoContent.value =
        '<div id="iw-container">\n\
                <div class="iw-content">'+
        '<table class="table table-sm" style="background: #1D2936">';

    //----------------------looping through the json object property--------------------------
    $.each(data, function(key,value){
        console.log(key + "/" + value );
        infoContent.value +='<tr  style="white-space: nowrap;">' +
            '<td class="leftInfo" style="color: white"><b>'+key+'</b></td>' +
            '<td class="rightInfo" style="color: white">' + value + '</td>' +
            '</tr>';
    });

    infoContent.value +=  '<div>' +
        '</table>\n\
        </div></div></div></div>';
    infoPosition.value = {lat:parseFloat(lat),lng:parseFloat(lng)};

    return {infoContent,infoPosition}
}
export default toggleInfoJsonMarker;
