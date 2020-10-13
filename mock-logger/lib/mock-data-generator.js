import { randomBetween } from './utils'
import userGenerate from './user-generator'
import gameGegerate from './game-generator'
import eventsGenerate from './events-generator'
import forever from './events-forever'

async function generate(timeRange, userCount, gameCount) {
    let users = userGenerate(timeRange, userCount)
    let games = gameGegerate(gameCount)

    // let eventList = []

    // map ['2020-01-01',[events], ..]
    let eventsDays = new Map()
    // let currentTime = new Date().getTime()

    for (let time = timeRange.start; time <= timeRange.end; time = time + 1000 * 60 * 60 * 24) {
        eventsDays.set(time, [])
    }


    for (const user of users) {
        let game = chooseOneGame(games)
        let events = eventsGenerate(user, timeRange, game)
        // eventList.push(...events)
        events.forEach(event => {
            let time = new Date(event['@timestamp']).setHours(0, 0, 0, 0)
            let list = eventsDays.get(time)
            if (list == null) throw `can not find event list for ${time}`
            list.push(event)
        })
    }

    // eventList.sort((a, b) => a['@timestamp'] - b['@timestamp'])

    // for (let event of eventList) {
    //     console.log(JSON.stringify(event))
    // }

    for (let time = timeRange.start; time <= timeRange.end; time = time + 1000 * 60 * 60 * 24) {
        let events = eventsDays.get(time)
        for (let event of events) {
            console.log(JSON.stringify(event))
        }
    }

    await forever(users, games)
}

function chooseOneGame(games) {
    let chooseIndex = randomBetween(0, games.length - 1)
    return games[chooseIndex]
}


export default generate