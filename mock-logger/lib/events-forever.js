import delay from 'delay'
import { randomBetween } from './utils'
import { CHOOSE_USERS_COUNT, AVERAGE_EVENTS, DELAY_MIN, DELAY_MAX } from './config'

// const CHOOSE_USERS_COUNT = 100
// const AVERAGE_EVENTS = 5
// const DELAY_MIN = 10
// const DELAY_MAX = 1000 * 60


async function generate(users, games, delayRange = { min: DELAY_MIN, max: DELAY_MAX }) {
    for (; ;) {
        const choosenUsers = chooseSomeUsers(users, CHOOSE_USERS_COUNT)
        for (let i = 0; i < choosenUsers.length * AVERAGE_EVENTS; i++) {
            let user = choosenUsers[randomBetween(0, choosenUsers.length - 1)]
            let event = {
                user_id: user.id,
                create_at: user.createAt,
                "@timestamp": new Date().getTime()
            }
            if (user.game == null) {
                user.game = games[randomBetween(0, games.length - 1)]
                user.firstOpen = event['@timestamp']

                event.type = 'open_game'
                event.game = {
                    id: user.game.id,
                    first_open: user.firstOpen
                }
            } else {
                event.type = 'play_game'
                event.game = {
                    id: user.game.id,
                    first_open: user.firstOpen
                }

                if (user.firstSceneTime == null) {
                    user.firstSceneTime = event['@timestamp']
                    event.game.scene_id = user.game.scenes[0]
                } else {
                    event.game.scene_id = user.game.scenes[randomBetween(0, games.length - 1)]
                    event.game.retention = true
                }
            }

            console.log(JSON.stringify(event))

            const { min, max } = delayRange
            await delay(randomBetween(min, max))
        }
    }
}

function chooseSomeUsers(users, userCount) {
    let choosenUsers = []
    for (let i = 0; i < userCount; i++) {
        choosenUsers.push(users[randomBetween(0, users.length - 1)])
    }

    return choosenUsers
}

export default generate