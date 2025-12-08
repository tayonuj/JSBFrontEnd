import * as am5 from '@amcharts/amcharts5';
import * as am5pie from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {ref} from "vue";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

let root;

const pieChart = (chart_data, chartdiv ,colors) => {
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

    let chart = root.container.children.push(am5pie.PieChart.new(root, {}));

    // Create a color set from the colors array
    let colorSet = am5.ColorSet.new(root, {
        list: colors.map(color => am5.Color.fromString(color))
    });
    chart.colors = colorSet;

    let series = chart.series.push(am5pie.PieSeries.new(root, {
        name: "",
        categoryField: labelx,
        valueField: labely
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
    series.labels.template.setAll({  fontSize:8 });
    // Exporting setup
    let exporting = am5plugins_exporting.Exporting.new(root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, {})
    });
    // Create and configure the legend
    // let legend = chart.children.push(am5.Legend.new(root, {
    //     marginTop: 15,
    //     marginBottom: 15, // Add space at the bottom
    //     layout: root.gridLayout, // Use a grid layout for the legend items
    //     width: am5.percent(100) // Make the legend span the full width
    // }));
    //
    // // Set font size for legend labels
    // legend.labels.template.setAll({
    //     fontSize: 12 // Set your desired font size
    // });

    // legend.valueLabels.template.setAll({
    //     fontSize: 12 // Set font size for value labels if needed
    // });
    //
    // legend.data.setAll(series.dataItems);

    // Populate labelColorArray with labels and colors from the series dataItems
    // Populate labelColorArray with labels and colors from the series dataItems
    for (let i = 0; i < series.dataItems.length; i++) {
        let dataItem = series.dataItems[i];
        // console.log("fucking data items",dataItem.dataContext[labelx])
        let label = dataItem.dataContext[labelx];
        let color = chart.colors.getIndex(i).toString();
        labelColorArray.value.push({ chartLabelx: label, color: color });
    }
    return {labelColorArray};
}

export default pieChart;
