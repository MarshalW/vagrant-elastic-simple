import { randomBetween } from './utils'
import userGenerate from './user-generator'
import gameGegerate from './game-generator'
import eventsGenerate from './events-generator'

function generate(timeRange, userCount, gameCount, db) {
    // console.time('prepare user/game data')
    let users = userGenerate(timeRange, userCount)
    let games = gameGegerate(gameCount)
    // console.timeEnd('prepare user/game data')

    let eventList = []

    // console.time('generate events')

    for (const user of users) {
        let game = chooseOneGame(games)
        let events = eventsGenerate(user, timeRange, game)
        eventList.push(...events)
    }

    // console.timeEnd('generate events')

    // console.time('event sort')
    eventList.sort((a, b) => a['@timestamp'] - b['@timestamp'])
    // console.timeEnd('event sort')

    // console.log(`all events: ${eventList.length}, users: ${users.length}`)

    return eventList
}

function chooseOneGame(games) {
    let chooseIndex = randomBetween(0, games.length - 1)
    return games[chooseIndex]
}


export default generate