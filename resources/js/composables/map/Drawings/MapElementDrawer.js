
const UJPointSymbol = (color,scale = 3.5) => {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 3.5,
        fillColor: color,
        fillOpacity: 0.6,
        strokeWeight: 0.3,
        labelOrigin: {x: -7, y: 0}
    }
}

const UJPoint = (lat,lng,color,scale = 3.5) => {
    return new google.maps.Marker({
        position: {lat:lat,lng:lng},
        icon:UJPointSymbol(color,scale),
    })
}

const UJCircle = (lat,lng,radius,strokeColor,fillColor,opacity) => {
    return new google.maps.Circle({
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: opacity,
        center: {lat:lat,lng:lng},
        radius: radius
    });
}



export {UJPointSymbol,UJPoint,UJCircle}
