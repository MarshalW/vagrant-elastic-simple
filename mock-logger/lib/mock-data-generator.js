import { randomBetween } from './utils'
import userGenerate from './user-generator'
import gameGegerate from './game-generator'
import eventsGenerate from './events-generator'
import forever from './events-forever'

async function generate(timeRange, userCount, gameCount) {
    let users = userGenerate(timeRange, userCount)
    let games = gameGegerate(gameCount)

    let eventList = []

    for (const user of users) {
        let game = chooseOneGame(games)
        let events = eventsGenerate(user, timeRange, game)
        eventList.push(...events)
    }

    eventList.sort((a, b) => a['@timestamp'] - b['@timestamp'])

    for (let event of eventList) {
        console.log(JSON.stringify(event))
    }

    await forever(users, games)
}

function chooseOneGame(games) {
    let chooseIndex = randomBetween(0, games.length - 1)
    return games[chooseIndex]
}


export default generate