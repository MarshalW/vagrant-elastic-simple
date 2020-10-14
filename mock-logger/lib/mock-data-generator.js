import { randomBetween } from './utils'
import userGenerate from './user-generator'
import gameGegerate from './game-generator'
import eventsGenerate from './events-generator'
import forever from './events-forever'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

async function generate(timeRange, userCount, gameCount) {
    let users = userGenerate(timeRange, userCount)
    let games = gameGegerate(gameCount)

    const db = await open({ filename: ':memory:', driver: sqlite3.Database })
    await db.exec("CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT,time INTEGER, content TEXT)")

    for (const user of users) {
        let game = chooseOneGame(games)
        let events = eventsGenerate(user, timeRange, game)

        for (const event of events) {
            await db.run("insert into history(time, content) values (?, ?)", event['@timestamp'], JSON.stringify(event))
        }
    }

    await db.run('CREATE INDEX idx_cache_time ON history (time)')

    let result = await db.get("SELECT COUNT(*) AS count FROM history")
    const count = result.count

    if (count > 0) {
        // console.log(`count: ${count}`)
        const stmt = await db.prepare('SELECT content FROM history order by time asc limit ? offset ?')
        for (let i = 0; i < count; i += 1000) {
            result = await stmt.all(1000, i)
            for (let r of result) {
                console.log(r.content)
            }
        }
    }

    // let eventList = []

    // map ['2020-01-01',[events], ..]
    // let eventsDays = new Map()
    // let currentTime = new Date().getTime()

    // for (let time = timeRange.start; time <= timeRange.end; time = time + 1000 * 60 * 60 * 24) {
    //     eventsDays.set(time, [])
    // }


    // for (const user of users) {
    //     let game = chooseOneGame(games)
    //     let events = eventsGenerate(user, timeRange, game)
    //     // eventList.push(...events)
    //     events.forEach(event => {
    //         let time = new Date(event['@timestamp']).setHours(0, 0, 0, 0)
    //         let list = eventsDays.get(time)
    //         if (list == null) throw `can not find event list for ${time}`
    //         list.push(event)
    //     })
    // }

    // eventList.sort((a, b) => a['@timestamp'] - b['@timestamp'])

    // for (let event of eventList) {
    //     console.log(JSON.stringify(event))
    // }

    // for (let time = timeRange.start; time <= timeRange.end; time = time + 1000 * 60 * 60 * 24) {
    //     let events = eventsDays.get(time)
    //     for (let event of events) {
    //         console.log(JSON.stringify(event))
    //     }
    // }

    await forever(users, games)
}

function chooseOneGame(games) {
    let chooseIndex = randomBetween(0, games.length - 1)
    return games[chooseIndex]
}


export default generate