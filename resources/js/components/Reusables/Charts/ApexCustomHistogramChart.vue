<template>
    <ApexCharts :height="chart.height" :options="chart.options" :series="chart.series"></ApexCharts>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import ApexCharts from '../../../components/plugins/Apexcharts.vue';
import { defineProps } from 'vue';
import {useAppVariableStore} from "../../../stores/app-variable";

const props = defineProps({
    data: Array,
    mainTitle: String,
    categoryKey: String,
    valueKey: String,
    isStacked: { type: Boolean, default: false },
});
const appVariable = useAppVariableStore();
const chart = ref({
    height: 300,
    options: {
        chart: {
            type: 'bar',
            stacked: props.isStacked,
            toolbar: {
                show: true
            }
        },
        plotOptions: {
            bar: {
                columnWidth: "95%",
                borderRadius: 5,
            }
        },
        dataLabels: { enabled: false },
        stroke: { width: [0, 0, 3] },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        colors: [
            appVariable.color.theme,
            'rgba(' + appVariable.color.bodyColorRgb + ', .5)',
            appVariable.color.warning
        ],
        title: {
            text: '',
            align: 'left',
            offsetX: 110
        },
        xaxis: {
            type: 'numeric', // Use numeric values for x-axis
            min: 0, // Start the x-axis from 0
            max: 7, // Assuming '7' is the end of your range; adjust as needed
            tickAmount: 7, // Adjust this based on the number of intervals you want to display
            labels: {
                formatter: function(val) {
                    // Custom formatter to display categories as labels
                    const inverseMapping = {
                        1: '0-1',
                        2: '1-2',
                        6: '2-6',
                        7: '6+'
                    };
                    return inverseMapping[val] || val;
                },
                style: {
                    colors: appVariable.color.bodyColor,
                    fontSize: '12px',
                    fontFamily: appVariable.font.bodyFontFamily,
                    fontWeight: appVariable.font.bodyFontWeight,
                    cssClass: 'apexcharts-xaxis-label',
                }
            },
            axisTicks: {
                show: true,
                borderType: 'solid',
                color: appVariable.color.gray300,
                height: 6,
                offsetX: 0,
                offsetY: 0
            },
        },
        yaxis: [{

            axisTicks: { show: true, color: appVariable.color.borderColor },
            axisBorder: { show: true, color: appVariable.color.theme },
            labels: {
                style: { colors: [appVariable.color.bodyColor] } ,
                formatter: function(val) {
                    let rounded = Math.round(val);
                    if (rounded > 100000000) {
                        return (rounded / 1000000) + " M";
                    } else if (rounded > 10000000) {
                        return (rounded / 100000) + " LAK";
                    } else if (rounded > 100000) {
                        return (rounded / 1000) + " K";
                    } else {
                        return rounded;
                    }
                }
            },
            title: {
                style: { color: appVariable.color.bodyColor }
            },
        }],
        tooltip: {
            fixed: {
                enabled: true,
                position: 'topLeft',
                offsetY: 30,
                offsetX: 60
            },
        },
        legend: { horizontalAlign: 'left', offsetX: 40,labels: { colors: appVariable.color.bodyColor } }
    },
    series: []
});


const processChartData = () => {
    const series = []; // Initialize an array for the series
    const categoryMapping = {
        'Less_1': 1,
        '1_0_1_2': 2,
        '1_2_1_6': 6,
        'more_1_6': 7
    };

    const dataset = props.data[0]; // Assuming there is only one dataset

    const seriesData = dataset.data.map(item => ({
        x: categoryMapping[item.attribute] || item.attribute,
        y: item.sum
    }));
    // Explicitly check for and add missing categories/ranges
    const expectedCategories = [1, 2, 6, 7]; // The expected x values
    expectedCategories.forEach(x => {
        if (!seriesData.some(dataPoint => dataPoint.x === x)) {
            seriesData.push({ x: x, y: 0 }); // Add a placeholder for missing categories
        }
    });

    // Sort seriesData by x to ensure correct order
    seriesData.sort((a, b) => a.x - b.x);
    series.push({
        name: dataset.title,
        data: seriesData
    });

    // Update only the series part of the chart
    chart.value.series = series;
};


watchEffect(() => {
    processChartData();
});
</script>
