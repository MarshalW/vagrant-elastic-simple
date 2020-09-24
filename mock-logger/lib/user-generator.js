
import { nanoid } from 'nanoid'
import { randomBetween } from './utils'

const ID_LENGTH = 10

function generate(timeRange, userCount) {
    let days = []

    // 平均每天需创建的用户数
    let userPerDay = Math.ceil(userCount * 1.0 / timeRange.daysAgo)

    for (let i = 0, currentDay = timeRange.start;
        i < timeRange.daysAgo;
        i++, currentDay = currentDay + 1000 * 60 * 60 * 24) {
        let users = []
        for (let j = 0; j < userPerDay; j++) {
            let user = generateNewUser()
            users.push(user)
            // 创建时间取当前日期0点+1s到24点-1s之间的随机数
            user.createAt = currentDay + randomBetween(1000, 1000 * 60 * 60 * 24 - 1000)
        }
        days.push(users)
    }

    return days.flat()
}

function generateNewUser() {
    return {
        id: nanoid(ID_LENGTH)
    }
}

export default generate