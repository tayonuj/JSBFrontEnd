import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

let root;

const lineChart = (chart_data, chartdiv, isDate, colors,labelx) => {
    let years = []; // To store the years from the dataset

    // Check for data and extract years
    if (chart_data && chart_data.length > 0) {
        years = Object.keys(chart_data[0]).filter(key => key !== labelx);
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
        rotation: -45, // Rotate labels by -45 degrees
        centerY: am5.p50,
        centerX: am5.p50,
        paddingRight: 10,
        fontSize: 8, // Smaller font size
        maxWidth: 8, // Set a maximum width for labels
        truncate: true, // Enable truncation
        ellipsis: '...' // Add ellipsis for overflow
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
            min: 0,
            renderer: am5xy.AxisRendererY.new(root, {
                strokeOpacity: 0.1,
            }),
            tooltip: am5.Tooltip.new(root, {}),
            logarithmic: false,
        })
    );
// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let colorIndex = 0;

    // Transform and create series for each year
    console.log("fucking years",years);
    let xdata = [];

    let legend = chart.children.push(am5.Legend.new(root, {
        y: am5.percent(100),
        x:  am5.p50,
        centerY: am5.percent(100),
        centerX:  am5.p50,
        layout: root.horizontalLayout,
        marginTop: 10,
    }));

    legend.labels.template.setAll({
        fontSize: 10,
        fontWeight: "100"
    });

    years.forEach((year, index) => {
        // let seriesData = chart_data.map(item => ({ category: item[labelx], value: item[year] }));

        let series = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: year,
                legendValueText: "{valueY}",
                calculateAggregates: true,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: year,
                categoryXField: 'dsd',
                tooltip: am5.Tooltip.new(root, {
                    labelText: "value: {valueY}\ncategory: {categoryX}"
                }),

            })
        );

        // Add circle bullet
        series.bullets.push(function() {
            let graphics = am5.Circle.new(root, {
                strokeWidth: 1,
                radius: 4,
                stroke: series.get("stroke"),
                fill: root.interfaceColors.get("background")
            });
            return am5.Bullet.new(root, {sprite: graphics});
        });
        xdata = chart_data;
        series.data.setAll(chart_data);
        legend.data.push(series);

    });
    xAxis.data.setAll(xdata);
    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        behavior: "zoomX"
    }));


    // Exporting setup
    let exporting = am5plugins_exporting.Exporting.new(root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, {})
    });

    // Make stuff animate on load
    chart.appear(1000, 100);
}

export default lineChart;
