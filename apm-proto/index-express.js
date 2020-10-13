// import elasticApmNode from 'elastic-apm-node'
// const apm = elasticApmNode.start({
//     serviceName: 'apm-proto',
//     serverUrl: 'http://192.168.100.10:8200',
//     captureBody: 'all',
//     usePathAsTransactionName: true
// })

import apm from 'elastic-apm-node/start'

import App from 'express'
import axios from 'axios'
import mysql from 'mysql'

const connection = mysql.createConnection({
    host: '192.168.100.11',
    user: 'root',
    password: 'password',
    database: 'test'
})

const app = App()

app.get('/', async function (req, res) {
    try {
        const response = await axios.get('https://www.baidu.com')
        console.log(response)
    } catch (error) {
        apm.captureError(error)
    }

    await new Promise(function (resolve, reject) {
        connection.query('select count(*) as total from persons', function (error, results) {
            if (error) apm.captureError(error)
            console.log('The solution is: ', results[0].total)
            resolve()
        })
    })

    res.send('Hello World!')
})

app.listen(3000)