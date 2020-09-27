import generate from './lib/mock-data-generator'
import { DYAS_AGO, USER_COUNT, GAME_COUNT } from './lib/config'


(async () => {
    // const DYAS_AGO = 30
    // const USER_COUNT = 10000 * 1
    // const GAME_COUNT = 5

    await generate(getTimeRange(DYAS_AGO), USER_COUNT, GAME_COUNT)
})()

function getTimeRange(daysAgo) {
    // 设置截止时间为本地时间今日0时
    let end = new Date().setHours(0, 0, 0, 0)
    // 设置开始时间，从截止时间前推daysAgo日的时间
    let start = end - 1000 * 60 * 60 * 24 * daysAgo

    return { start, end, daysAgo }
}
