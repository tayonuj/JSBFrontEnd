<template>
    <canvas ref="canvasRef" :height="height" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';
import { useAppVariableStore } from '../../stores/app-variable';

const props = defineProps({
    data: Object,
    type: String,
    options: Object,
    width: String,
    height: String,
});

const canvasRef = ref(null);

const appVariable = useAppVariableStore();

onMounted(() => {
    Chart.defaults.font.family = appVariable.font.bodyFontFamily;
    Chart.defaults.font.size = 12;
    Chart.defaults.color = appVariable.color.bodyColor;
    Chart.defaults.borderColor = appVariable.color.borderColor;
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.plugins.tooltip.padding = { left: 8, right: 12, top: 8, bottom: 8 };
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleMarginBottom = 6;
    Chart.defaults.plugins.tooltip.color = appVariable.color.componentBg;
    Chart.defaults.plugins.tooltip.multiKeyBackground = appVariable.color.componentColor;
    Chart.defaults.plugins.tooltip.backgroundColor = appVariable.color.componentColor;
    Chart.defaults.plugins.tooltip.titleFont.family = appVariable.font.bodyFontFamily;
    Chart.defaults.plugins.tooltip.titleFont.weight = appVariable.font.bodyFontWeight;
    Chart.defaults.plugins.tooltip.footerFont.family = appVariable.font.bodyFontFamily;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.boxPadding = 6;
    Chart.defaults.scale.grid.color = appVariable.color.borderColor;
    Chart.defaults.scale.beginAtZero = true;

    new Chart(canvasRef.value, {
        type: props.type,
        data: props.data,
        options: props.options,
    });
});
</script>
