
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {ref} from "vue";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

let root;

const barChart = async (chart_data,chartdiv,colors)=>{
    const labelColorArray = ref([]);
    //generating x,y labels based on dataset provided
    let labelx , labely = "";
    if (chart_data && chart_data.length>0) {
        let labels = Object.keys(chart_data[0]);
        if (labels && labels.length > 0) {
            labelx = labels[0];
            labely = labels[1];
        }
    }

    // Dispose of the previous chart instance if it exists
    if (root) {
        root.dispose();
    }
    root = am5.Root.new(chartdiv.value);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panY: false,
            layout: root.verticalLayout,
        })
    );

    // Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
        rotation: -45,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15,
        fontSize: 10,
        wrap:true
    });

    xRenderer.grid.template.setAll({
        location: 1
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: labelx,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1
        }),
        logarithmic: true,
    }));


// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: labely,
        sequencedInterpolation: true,
        categoryXField: labelx,
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
        })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    // series.columns.template.adapters.add("fill", function(fill, target) {
    //     return chart.get("colors").getIndex(series.columns.indexOf(target));
    // });
    //
    // series.columns.template.adapters.add("stroke", function(stroke, target) {
    //     return chart.get("colors").getIndex(series.columns.indexOf(target));
    // });


// Set data
//     var data = [{
//         country: "USA",
//         value: 2025
//     }, {
//         country: "China",
//         value: 1882
//     }, {
//         country: "Japan",
//         value: 1809
//     }, {
//         country: "Germany",
//         value: 1322
//     }, {
//         country: "UK",
//         value: 1122
//     }, {
//         country: "France",
//         value: 1114
//     }, {
//         country: "India",
//         value: 984
//     }, {
//         country: "Spain",
//         value: 711
//     }, {
//         country: "Netherlands",
//         value: 665
//     }, {
//         country: "South Korea",
//         value: 443
//     }, {
//         country: "Canada",
//         value: 441
//     }];
    // Process chart_data to ensure numerical values
    chart_data.forEach((dataPoint) => {
        const yValue = parseFloat(dataPoint[labely]);
        // console.log("fucking values "+dataPoint[labely],yValue);
        if (isNaN(yValue) || yValue <= 0) {
            dataPoint[labely] = 0.1; // Set to a small positive value for logarithmic scale
        } else {
            dataPoint[labely] = yValue;
        }
    });
    // console.log("fucking values ",chart_data);
    xAxis.data.setAll(chart_data);
    series.data.setAll(chart_data);
    // Use color array for column fill
    let colorIndex = 0;

    series.columns.template.adapters.add("fill", function(fill, target) {
        const label = target.dataItem.get("categoryX");
        const existingEntry = labelColorArray.value.find(entry => entry.chartLabelx === label);
        let color;
        if (existingEntry) {
            // If an entry for this label already exists, use the existing color
            color = existingEntry.color;
        } else {
            // Otherwise, use a new color and update colorIndex and labelColorArray
            color = colors[colorIndex % colors.length];
            labelColorArray.value.push({ chartLabelx: label, color: color });
            colorIndex++;
        }
        return am5.Color.fromString(color);
    });

    series.columns.template.adapters.add("stroke", function(stroke, target) {
        const color = colors[series.columns.indexOf(target) % colors.length];
        return am5.Color.fromString(color);
    });

    // Exporting setup
    let exporting = am5plugins_exporting.Exporting.new(root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, {})
    });
// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
    await series.appear(1000);
    await chart.appear(1000, 100);

    return {labelColorArray};
}

export default barChart;
