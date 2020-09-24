/**
 * 生成最小和最大数之间的随机数
 * @param {*} min 
 * @param {*} max 
 */
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export {
    randomBetween
}