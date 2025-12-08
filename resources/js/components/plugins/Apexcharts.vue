<script setup>
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
// import { useAppVariableStore } from '../../stores/app-variable';

// const appVariable = useAppVariableStore();

const apexConfiguration = computed(() => ({
    title: {
        style: {
            fontSize: '14px',
            fontWeight: '600',
            // fontFamily: appVariable.font.bodyFontFamily,
            // color: appVariable.color.bodyColor
        }
    },
    legend: {
        // fontFamily: appVariable.font.bodyFontFamily,
        // labels: { colors: appVariable.color.bodyColor }
    },
    tooltip: {
        style: {
            fontSize: '12px',
            // fontFamily: appVariable.font.bodyFontFamily
        }
    },
    grid: {
      // borderColor: appVariable.color.borderColor
    },
    dataLabels: {
        style: {
            fontSize: '12px',
            // fontFamily: appVariable.font.bodyFontFamily,
            fontWeight: '600',
            colors: undefined
        }
    },
    xaxis: {
        axisBorder: {
            show: true,
            // color: appVariable.color.borderColor,
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: -1
        },
        axisTicks: {
            show: true,
            borderType: 'solid',
            // color: appVariable.color.borderColor,
            height: 6,
            offsetX: 0,
            offsetY: 0
        },
        labels: {
            style: {
                // colors: appVariable.color.bodyColor,
                fontSize: '12px',
                // fontFamily: appVariable.font.bodyFontFamily,
                // fontWeight: appVariable.font.bodyFontWeight,
                cssClass: 'apexcharts-xaxis-label',
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                // colors: appVariable.color.bodyColor,
                fontSize: '12px',
                // fontFamily: appVariable.font.bodyFontFamily,
                // fontWeight: appVariable.font.bodyFontWeight,
                cssClass: 'apexcharts-xaxis-label',
            }
        }
    }
}));

const props = defineProps({
    height: String,
    options: Object,
    series: Array
});
</script>

<template>
    <div>
        <VueApexCharts
            :height="props.height"
            :options="props.options || apexConfiguration"
            :series="props.series"
        ></VueApexCharts>
    </div>
</template>
