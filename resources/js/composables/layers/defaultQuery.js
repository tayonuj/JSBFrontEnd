const groupedAttrValues = (layer, layerType, selectedAttr, googleProperty) => {
    let groupedData;
    let dataArr = [];
    layer.forEach(function(feature) {
        if (layerType === 'point') {
            dataArr.push(feature);
        } else {
            dataArr.push(feature[googleProperty]);
        }
    });
    groupedData = _.groupBy(dataArr, selectedAttr);
    let arr = Object.keys(groupedData);
    arr = _.without(arr, null, undefined, 'undefined');
    return arr;
}

const filterSwitch = (layer, attr, operator, values) => {
    const newdataset = [];
    layer.forEach((point) => {
        if (Array.isArray(values) && values.length === 2) {
            // Handle date range filtering
            const [startDate, endDate] = values.map(date => new Date(date));
            const pointDate = new Date(point[attr]);
            if (!isNaN(pointDate)) {
                if (pointDate >= startDate && pointDate <= endDate) {
                    newdataset.push(point);
                }
            }
        } else {
            // Handle other filtering
            switch (operator) {
                case '=':
                    if (isNaN(parseFloat(point[attr]))) {
                        if (point[attr] && point[attr].toLowerCase() === values.toLowerCase()) {
                            newdataset.push(point);
                        }
                    } else {
                        if (parseFloat(point[attr]) === parseFloat(values)) {
                            newdataset.push(point);
                        }
                    }
                    break;
                case '>':
                    if (!isNaN(parseFloat(point[attr]))) {
                        if (parseFloat(point[attr]) > parseFloat(values)) {
                            newdataset.push(point);
                        }
                    }
                    break;
                case '<':
                    if (!isNaN(parseFloat(point[attr]))) {
                        if (parseFloat(point[attr]) < parseFloat(values)) {
                            newdataset.push(point);
                        }
                    }
                    break;
                case '≠':
                    if (point[attr] !== values) {
                        newdataset.push(point);
                    }
                    break;
            }
        }
    });
    return newdataset;
}

export { groupedAttrValues, filterSwitch }
