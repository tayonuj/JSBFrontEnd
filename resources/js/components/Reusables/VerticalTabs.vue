<template>
    <div :style="containerStyle" class="vertical-tabs" :class="{'vertical-tabs--vertical-text': verticalText, 'vertical-tabs--horizontal-text': !verticalText}">
        <v-tabs :value="value" @input="$emit('input', $event)" :show-arrows="verticalText" :color="color" :slider-color="sliderColor" :style="tabsStyle">
            <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
        </v-tabs>
    </div>
</template>

<script>
export default {
    name: 'vertical-tabs',
    props: {
        color: String,
        height: {
            type: [Number, String],
            default: 300,
        },
        items: Array,
        sliderColor: String,
        value: null,
        verticalText: Boolean,
    },
    computed: {
        containerStyle () {
            return this.verticalText ? {
                height: isNaN(this.height) ? this.height : `${this.height}px`,
            } : {
                height: (48 * this.items.length) + 'px',
            }
        },
        tabsStyle () {
            return this.verticalText ? {
                width: isNaN(this.height) ? this.height : `${this.height}px`,
            } : {}
        },
    },
}
</script>
<style scoped>
.vertical-tabs {
    overflow: hidden;
}
.vertical-tabs--horizontal-text .v-tabs {
    transform: rotate(90deg);
    transform-origin: 100px 100px;
    height: 100px;
}
.vertical-tabs--horizontal-text .v-tabs >>> .v-tabs__container {
    height: 100px;
}
.vertical-tabs--horizontal-text .v-tabs >>> .v-tabs__div {
    width: 25px;
    height: 100px;
    display: inline-block;
}
.vertical-tabs--horizontal-text .v-tabs >>> .v-tabs__item {
    transform: rotate(-90deg);
    transform-origin: 100px 100px;
    width: 50px;
    height: 48px;
    display: block;
    text-align: left;
    line-height: 36px;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
}
.vertical-tabs--vertical-text {
    width: 48px;
}
.vertical-tabs--vertical-text .v-tabs {
    transform: rotate(90deg);
    transform-origin: 24px 24px;
}
.vertical-tabs--vertical-text .v-tabs >>> .v-tabs__item {
    transform: rotate(180deg);
}
.vertical-tabs--vertical-text .v-tabs >>> .v-tabs__slider-wrapper {
    top: 0;
    bottom: auto;
}
</style>
