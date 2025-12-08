<template>
    <ApexCharts :height="chart.height" :options="chart.options" :series="chart.series"></ApexCharts>
</template>

<script setup>
import {onMounted, ref, watchEffect} from 'vue';
import { defineProps } from 'vue';
import ApexCharts from '../../../components/plugins/Apexcharts.vue';
// import { useAppVariableStore } from '../../../stores/app-variable';

// Define props
const props = defineProps({
    data: Array,
    mainTitle: String,
    categoryKey: String,
    valueKey: String,
    isStacked:{ type: Boolean, required: false, default: false },
});

// const appVariable = useAppVariableStore();


    const chart = ref({
        height: 300,
        options: {
            chart: {
                type: 'bar',
                stacked:props.isStacked
            },
            dataLabels: { enabled: false },
            stroke: { width: [0, 0, 3] },
            // colors: [
            //     appVariable.color.warning,
            //     appVariable.color.theme,
            //     'rgba(' + appVariable.color.bodyColorRgb + ', .5)',
            //     appVariable.color.pink,
            //     appVariable.color.indigo,
            // ],
            title: {
                text: '',
                align: 'left',
                offsetX: 110
            },
            xaxis: {
                categories: [],
                // labels: {
                //     style: {
                //         colors: appVariable.color.bodyColor,
                //         fontSize: '8px',
                //         fontFamily: appVariable.font.bodyFontFamily,
                //         fontWeight: appVariable.font.bodyFontWeight,
                //         cssClass: 'apexcharts-xaxis-label',
                //     }
                // },
                axisTicks: {
                    show: true,
                    borderType: 'solid',
                    // color: appVariable.color.gray300,
                    height: 6,
                    offsetX: 0,
                    offsetY: 0
                },
            },
            yaxis: [{

                axisTicks: { show: true,
                  // color: appVariable.color.borderColor
                },
                axisBorder: { show: true,
                  // color: appVariable.color.theme
                },
                labels: {
                    // style: { colors: [appVariable.color.bodyColor] } ,
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
                // title: {
                //     style: { color: appVariable.color.bodyColor }
                // },
            }],
            tooltip: {
                fixed: {
                    enabled: true,
                    position: 'topLeft',
                    offsetY: 30,
                    offsetX: 60
                },
            },
            legend: { horizontalAlign: 'left', offsetX: 10,
              // labels: { colors: appVariable.color.bodyColor }
            }
        },
        series: []
    });

    // Function to process dataset
const processChartData = () => {
    const series = [];
    const categoriesSet = new Set();

    // Collect all categories based on dynamic key and ensure they are unique
    props.data.forEach(item => {
        item.data.forEach(dataPoint => {
            categoriesSet.add(dataPoint[props.categoryKey]);
        });
    });

    // Sort the categories to ensure they are in order
    // const sortedCategories = Array.from(categoriesSet).sort((a, b) =>
    //     a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));

    const sortedCategories = Array.from(categoriesSet);

    // Process each series based on dynamic keys
    props.data.forEach(item => {
        const seriesData = sortedCategories.map(category => {
            const dataPoint = item.data.find(dp => dp[props.categoryKey] === category);
            return dataPoint ? dataPoint[props.valueKey] : null;
        });

        series.push({ name: item.title, type: item.type, data: seriesData });
    });

    // Update the chart with processed data
    chart.value.series = series;
    chart.value.options.xaxis.categories = sortedCategories;
};



    // Watch for changes in dataset and mainTitle props and update chart config
watchEffect(() => {
    processChartData();
});
</script>
