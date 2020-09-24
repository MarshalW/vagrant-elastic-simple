import generate from './lib/mock-data-generator'
import forever from './lib/events-forever'


(async () => {
    const DYAS_AGO = 365
    const USER_COUNT = 10000 * 1
    const GAME_COUNT = 20


    // console.time('all')

    let events = generate(getTimeRange(DYAS_AGO), USER_COUNT, GAME_COUNT)

    for (let event of events) {
        // await delay(10)
        console.log(JSON.stringify(event))
    }

    // console.timeEnd('all')

    await forever()
})()

function getTimeRange(daysAgo) {
    // 设置截止时间为本地时间今日0时
    let end = new Date().setHours(0, 0, 0, 0)
    // 设置开始时间，从截止时间前推daysAgo日的时间
    let start = end - 1000 * 60 * 60 * 24 * daysAgo

    return { start, end, daysAgo }
}
