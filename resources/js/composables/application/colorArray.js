function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const colorArray = (id) => {
    let colors = [
        "#bf0817", "#066ab1", "#181655", "#198f70", "#a31431",
        "#0a6194", "#8d2607", "#a21a38", "#581948", "#9a1d9a",
        "#14639f", "#27824a", "#2ca060", "#901832", "#8c2b73",
        "#84390b", "#caca02", "#46841f", "#1a5b34", "#1b6407",
    ];

    if (id < colors.length) {
        return colors[id];
    } else {
        return getRandomColor();
    }
};

export default colorArray;
