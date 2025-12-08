import {ref, onMounted, onUnmounted} from "vue";

/**
 * *Function is using for retrieve actual sizes of the screen and return the customization based on it
 * !the usage of this function may depend on the requirement of the UI designer
 * @param widthSpace {Number} is the space need from the actual screen width. this value will reduce from the actual width
 * @param heightSpace is the space need from the actual screen height. this value will reduce from the actual height
 * @returns {{applicationWindow: Ref<UnwrapRef<{width: number, mapWidth: number, height: number, mapHeight: number}>>}}
 */
const handleResize = (widthSpace,heightSpace)=> {
    const applicationWindow = ref({ width:0, height:0, mapWidth:0, mapHeight:0});

    const resize = () => {
        applicationWindow.value.width = window.innerWidth;
        applicationWindow.value.height = window.innerHeight;
        applicationWindow.value.lower_height = window.innerHeight;
        applicationWindow.value.mapwidth = window.innerWidth - widthSpace;
        applicationWindow.value.mapheight = window.innerHeight - heightSpace;
    }
    resize();
    onMounted(() => {
        window.addEventListener('resize', resize)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', resize)
    })
    return {applicationWindow};
}
export default handleResize;
