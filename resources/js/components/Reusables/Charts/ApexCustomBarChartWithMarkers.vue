<template>
    <ApexCharts :height="chart.height" :options="chart.options" :series="chart.series"></ApexCharts>
</template>

<script setup>
import {onMounted, ref, watchEffect} from 'vue';
import { defineProps } from 'vue';
import ApexCharts from '../../../components/plugins/Apexcharts.vue';
import { useAppVariableStore } from '../../../stores/app-variable';

// Define props
const props = defineProps({
    data: Array,
    mainTitle: String,
    categoryKey: String,
    valueKey: String,
    isStacked:{ type: Boolean, required: false, default: false },
});

const appVariable = useAppVariableStore();


    const chart = ref({
        height: 400,
        options: {
            chart: {
                type: 'bar',
                stacked:props.isStacked
            },
            dataLabels: { enabled: false },
            stroke: { width: [0, 0, 3] },
            colors: [
                appVariable.color.pink,
                appVariable.color.theme,
                'rgba(' + appVariable.color.bodyColorRgb + ', .5)',
                appVariable.color.indigo,
            ],
            title: {
                text: '',
                align: 'left',
                offsetX: 110
            },
            xaxis: {
                categories: [],
                labels: {
                    style: {
                        colors: appVariable.color.bodyColor,
                        fontSize: '8px',
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
            legend: { horizontalAlign: 'left', offsetX: 10,labels: { colors: appVariable.color.bodyColor } }
        },
        series: []
    });

    // Function to process dataset
// Function to process dataset
const processChartData = () => {
    const series = [];
    const categoriesSet = new Set();
    const expectedValues = {};

    // Collect all categories based on dynamic key and ensure they are unique
    props.data.forEach(item => {
        item.data.forEach(dataPoint => {
            categoriesSet.add(dataPoint[props.categoryKey]);
            expectedValues[dataPoint[props.categoryKey]] = dataPoint.expected;
        });
    });

    const sortedCategories = Array.from(categoriesSet);

    // Process each series based on dynamic keys
    props.data.forEach(item => {
        const seriesData = sortedCategories.map(category => {
            const dataPoint = item.data.find(dp => dp[props.categoryKey] === category);
            if (dataPoint) {
                return {
                    x: category,
                    y: dataPoint[props.valueKey],
                    goals: [
                        {
                            name: 'Expected',
                            value: expectedValues[category], // Use the expected value
                            strokeHeight: 5,
                            strokeColor: appVariable.color.themeColor
                        }
                    ]
                };
            } else {
                return null;
            }
        }).filter(dataPoint => dataPoint !== null);

        series.push({ name: item.title, data: seriesData });
    });

    // Update the chart with processed data
    chart.value.series = series;
    chart.value.options.xaxis.categories = sortedCategories; // Assuming you still want to keep the categories for the x-axis
};




    // Watch for changes in dataset and mainTitle props and update chart config
watchEffect(() => {
    processChartData();
});
</script>
