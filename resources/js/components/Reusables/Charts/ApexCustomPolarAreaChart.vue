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
    valueKey: String
});

const appVariable = useAppVariableStore();


    const chart = ref({
        height: 360,
        options: {
            chart: {
                type: 'polarArea',
            },
            // dataLabels: { dropShadow: { enabled: false, top: 1, left: 1, blur: 1, opacity: 1 } },
            stroke: { colors:[appVariable.color.theme] },
            colors: [
                appVariable.color.pink,
                appVariable.color.theme,
                'rgba(' + appVariable.color.bodyColorRgb + ', .5)',
                appVariable.color.warning,
                appVariable.color.indigo,
            ],
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
            legend: { labels: { colors: appVariable.color.bodyColor }, position: 'bottom' }
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
