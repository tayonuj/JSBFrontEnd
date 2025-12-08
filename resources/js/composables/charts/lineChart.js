import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

let root;

const lineChart = (chart_data, chartdiv,isDate,colors) => {
    //generating x,y labels based on dataset provided
    let labelx , labely = "";
    if (chart_data && chart_data.length>0) {
        let labels = Object.keys(chart_data[0]);
        if (labels && labels.length > 0) {
            labelx = labels[0];
            labely = labels[1];
        }
    }
    if (root) {
        root.dispose();
    }
    root = am5.Root.new(chartdiv.value);

    root.setThemes([am5themes_Animated.new(root)]);





// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelY: "zoomXY",
            pinchZoomX: true
        })
    );

    chart.get("colors").set("step", 2);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

    let xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30
    });
    xRenderer.labels.template.setAll({
        rotation: -45,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingRight: 15,
        fontSize: 10,
    });
    let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: labelx,
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        })
    );

    xRenderer.grid.template.setAll({
        location: 1
    })

    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            extraMax: 0.1,
            extraMin: 0.1,
            renderer: am5xy.AxisRendererY.new(root, {
                strokeOpacity: 0.1,
            }),
            tooltip: am5.Tooltip.new(root, {}),
            logarithmic: true,
        })
    );
// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let colorIndex = 0;
    let series = chart.series.push(
        am5xy.LineSeries.new(root, {
            calculateAggregates: true,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: labely,
            categoryXField: labelx,
            tooltip: am5.Tooltip.new(root, {
                labelText: "value: {valueY}\ncategory: {categoryX}"
            }),
            stroke: am5.Color.fromString(colors[colorIndex % colors.length])
        })
    );
    colorIndex++;
    if (isDate){
         xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                baseInterval: { timeUnit: "day", count: 1 },
                renderer: am5xy.AxisRendererX.new(root, {})
            })
        );
    }

// Add circle bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    series.bullets.push(function() {
        let graphics = am5.Circle.new(root, {
            strokeWidth: 1,
            radius: 4,
            stroke: series.get("stroke"),
            fill: root.interfaceColors.get("background")
        });
        return am5.Bullet.new(root, {
            sprite: graphics
        });
    });

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    chart.set("cursor", am5xy.XYCursor.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        snapToSeries: [series]
    }));

    // Process chart_data to ensure numerical values
    chart_data.forEach((dataPoint) => {
        const yValue = parseFloat(dataPoint[labely]);
        if (isNaN(yValue)) {
            dataPoint[labely] = 0; // Set to default value of 0 if not a number
        } else {
            dataPoint[labely] = yValue;
        }
    });
    series.data.setAll(chart_data);
    xAxis.data.setAll(chart_data);

    // Exporting setup
    let exporting = am5plugins_exporting.Exporting.new(root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, {})
    });
// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
}

export default lineChart;
