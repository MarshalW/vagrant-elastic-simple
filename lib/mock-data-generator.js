import userGenerate from './user-generator'
import gameGegerate from './game-generator'
import eventsGenerate from './events-generator'
import { output, init, setRefresh } from './elasticsearch-output'
import { randomBetween } from './utils'

async function generate(timeRange, userCount, gameCount) {
    let users = userGenerate(timeRange, userCount)
    let eventsCount = 0
    console.time('alltime')
    await init()

    await setRefresh("120s")
    let _userCount = 0

    console.log('start add documents..')

    for (const user of users) {
        let game = chooseOneGame(gameGegerate(gameCount))
        let events = eventsGenerate(user, timeRange, game)

        await output(events)

        eventsCount += events.length
        _userCount++
    }

    await setRefresh("1s")

    console.log(timeRange)
    console.log(`user count: ${_userCount}/${users.length}, events count: ${eventsCount}`)
    console.timeEnd('alltime')
}

function chooseOneGame(games) {
    let chooseIndex = randomBetween(0, games.length - 1)
    return games[chooseIndex]
}

export default generate