
<template>
    <chartjs :type="chart.type" :data="chart.data"></chartjs>

</template>

<script setup >
import {ref, watchEffect} from "vue";
    import Chartjs from "../../plugins/Chartjs.vue";

    const chart = ref({
        type: 'line',
        data: {
            // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            labels: [],
            datasets: [
            //     {
            //     color: appVariable.color.theme,
            //     backgroundColor: 'rgba(' + appVariable.color.themeRgb + ', .2)',
            //     borderColor: appVariable.color.theme,
            //     borderWidth: 1.5,
            //     pointBackgroundColor: appVariable.color.theme,
            //     pointBorderWidth: 1.5,
            //     pointRadius: 4,
            //     pointHoverBackgroundColor: appVariable.color.theme,
            //     pointHoverBorderColor: appVariable.color.theme,
            //     pointHoverRadius: 7,
            //     label: 'Total Sales',
            //     data: [12, 19, 4, 5, 2, 3]
            // }
            ]
        }
    });
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

        series.push(
            {
                color: appVariable.color.theme,
                backgroundColor: 'rgba(' + appVariable.color.themeRgb + ', .2)',
                borderColor: appVariable.color.theme,
                borderWidth: 1.5,
                pointBackgroundColor: appVariable.color.theme,
                pointBorderWidth: 1.5,
                pointRadius: 4,
                pointHoverBackgroundColor: appVariable.color.theme,
                pointHoverBorderColor: appVariable.color.theme,
                pointHoverRadius: 7,
                label: item.title,
                data: seriesData
            }
            );
    });

    // Update the chart with processed data
    chart.value.data.datasets = series;
    chart.value.data.labels = sortedCategories;
};



// Watch for changes in dataset and mainTitle props and update chart config
watchEffect(() => {
    processChartData();
});
</script>


<style scoped>

</style>
