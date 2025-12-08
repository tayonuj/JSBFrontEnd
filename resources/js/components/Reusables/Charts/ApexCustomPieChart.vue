<template>
    <ApexCharts :height="chart.height" :options="chart.options" :series="chart.series"></ApexCharts>
</template>

<script setup>
import {onMounted, ref, watchEffect} from 'vue';
import { defineProps } from 'vue';
import ApexCharts from '../../../components/plugins/Apexcharts.vue';

// Define props
const props = defineProps({
    data: Array,
    mainTitle: String,
    categoryKey: String,
    valueKey: String
});

// const appVariable = useAppVariableStore();


    const chart = ref({
        height: 200,
        options: {
            chart: {
                type: 'donut',
            },
            fill: {
                type: 'gradient',
            },
            dataLabels: {
                enabled: false
            },
            stroke: { show:false },
            // colors: [
            //     appVariable.color.theme,
            //     'rgba(' + appVariable.color.bodyColorRgb + ', .5)',
            //     appVariable.color.warning,
            //     appVariable.color.pink,
            //     appVariable.color.indigo,
            // ],
            title: {
                text: '',
                align: 'left',
                offsetX: 110
            },
            labels:[],
            tooltip: {
                fixed: {
                    enabled: true,
                    position: 'topLeft',
                    offsetY: 30,
                    offsetX: 60
                },
            },
            legend: {
              position: 'right',formatter: function(val, opts) {
                    return val + " - " + opts.w.globals.series[opts.seriesIndex]
                } },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
        series: []
    });

    // Function to process dataset
const processChartData = () => {
    const series = [];
    const categoriesSet = new Set();

    // Collect all categories based on dynamic key and ensure they are unique
    props.data.forEach(item => {
            categoriesSet.add(item[props.categoryKey]);
    });

    // Sort the categories to ensure they are in order
    const sortedCategories = Array.from(categoriesSet).sort((a, b) =>
        a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));

    // Process each series based on dynamic keys
    props.data.forEach(item => {
        series.push(item[props.valueKey]);
    });

    // Update the chart with processed data
    chart.value.series = series;
    chart.value.options.labels = sortedCategories;
};



    // Watch for changes in dataset and mainTitle props and update chart config
watchEffect(() => {
    processChartData();
});
</script>
