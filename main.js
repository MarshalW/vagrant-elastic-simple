// ESM syntax is supported.

import commander, { program } from 'commander'
import dataGenerate from './lib/mock-data-generator'



(async () => {
    const DEFAULT_DAYS = 10
    const DEFAULT_USERS_COUNT = DEFAULT_DAYS * 10
    const DEFAULT_GAME_COUNT = 10

    commander
        .version('0.1.0')
        .option("-a, --ago [params]", "n days ago", DEFAULT_DAYS)
        .option("-u, --user [params]", "user count", DEFAULT_USERS_COUNT)
        .option("-g, --game [params]", "game count", DEFAULT_GAME_COUNT)
        .parse(process.argv)

    await dataGenerate(getTimeRange(program.ago), program.user, program.game)
})()

function getTimeRange(daysAgo) {
    // 设置截止时间为本地时间今日0时
    let end = new Date().setHours(0, 0, 0, 0)
    // 设置开始时间，从截止时间前推daysAgo日的时间
    let start = end - 1000 * 60 * 60 * 24 * daysAgo

    return { start, end, daysAgo }
}