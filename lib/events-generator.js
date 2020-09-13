import { randomBetween } from './utils'

// 一个用户最多玩游戏的次数
const MAX_PLAY_GAME_TIMES = 100
// 一个用户最多玩游戏的天数
const MAX_PLAY_GAME_DAYS = 100

function generate(user, timeRange, game) {
    let events = []

    let signupEvent = generateSignupEvents(user)
    events.push(signupEvent)

    let openGameEvent = generateOpenEvents(user, game)
    if (openGameEvent["@timestamp"] < timeRange.end) {
        events.push(openGameEvent)
        let playGameEvents = generatePlayEvents(user, timeRange, game, openGameEvent)
        events = events.concat(playGameEvents)
    }

    return events
}

function generateSignupEvents(user) {
    let event = {
        "@timestamp": user.createAt,
        user_id: user.id,
        create_at: user.createAt,
        type: "signup"
    }
    return event
}

function generateOpenEvents(user, game) {
    // 打开游戏取创建用户时间20秒后，到用户注册后2小时之间的随机值
    let endTimestamp = user.createAt + 1000 * 60 * 60 * 2
    let openTime = randomBetween(user.createAt + 1000 * 20, endTimestamp)

    let event = {
        '@timestamp': openTime,
        user_id: user.id,
        create_at: user.createAt,
        type: "open_game",
        game: {
            id: game.id,
            first_open: openTime
        }
    }

    return event
}

function generatePlayEvents(user, timeRange, game, openGameEvent) {
    let playTimes = randomBetween(0, MAX_PLAY_GAME_TIMES)
    let events = []

    // 有可能加载游戏，但一次也没有玩
    if (playTimes == 0) {
        return events
    }


    for (let i = 0; i < playTimes; i++) {
        let playMaxEndTime = user.createAt + 1000 * 60 * 60 * 24 * MAX_PLAY_GAME_DAYS
        // 事件时间戳为加载游戏30秒后到最大时间之间的随机时间
        let timestamp = randomBetween(openGameEvent["@timestamp"] + 1000 * 30, playMaxEndTime)

        // 如果这个时间超过timeRange.end，就不生成了
        if (timestamp < timeRange.end) {
            let event = {
                '@timestamp': timestamp,
                user_id: user.id,
                create_at: user.createAt,
                type: 'play_game',
                game: {
                    id: game.id,
                    scene_id: game.scenes[randomBetween(0, game.scenes.length - 1)],
                    first_open: openGameEvent["@timestamp"],
                    retention: true
                }
            }

            events.push(event)
        }

    }

    if (events.length > 0) {
        // 玩游戏事件排序
        events.sort((event1, event2) => event1['@timestamp'] - event2['@timestamp'])

        // 第一次玩游戏事件应没有retention标记
        delete events[0].game.retention
    }

    return events
}

export default generate