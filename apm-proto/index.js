import elasticApmNode from 'elastic-apm-node'
const apm = elasticApmNode.start({
    serviceName: 'apm-proto',
    serverUrl: 'http://192.168.100.10:8200',
    captureBody: 'all',
    usePathAsTransactionName: true
})

import Koa from 'koa'
const app = new Koa()

import Router from 'koa-router'
const router = Router()

router.get('/', async (ctx) => {
    // apm.setTransactionName(`${ctx.method} ${ctx.url}`)
    ctx.body = 'Hello World'
})

app
    .use(async (ctx, next) => {
        const start = new Date()
        await next()
        const ms = new Date() - start
        console.log(`${ctx.method} ${ctx._matchedRoute} ${ctx.url} - ${ms}ms`)

        apm.setTransactionName(`${ctx.method} ${ctx.url}`)
    })
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(3000)

// import mysql from 'mysql'
// import util from 'util'
// const connection = mysql.createConnection({
//     host: '192.168.100.11',
//     user: 'root',
//     password: 'password',
//     database: 'test'
// })
// // const fn = util.promisify(connection.query).bind(connection)

// // app.use(async ctx => {
// //     // await connection.connect()
// //     // let results = await connection.query('select count(*) from persons')
// //     // results=JSON.stringify(results)
// //     const rows = await fn('select count(*) as total from persons')
// //     ctx.body = `Hello World ${rows.length}`
// //     // await connection.end()
// // })

// app.use(ctx => {
//     // ctx.body = 'Hello World ~~'
//     return new Promise(function (resolve, reject) {
//         connection.query('select count(*) as total from persons', function (error, results) {
//             if (error) throw error
//             console.log('The solution is: ', results[0].total)
//             ctx.response.body = 'Hello World ~~'
//             resolve()
//         })
//     })
// })

// app.listen(3000)