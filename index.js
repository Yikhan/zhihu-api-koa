const Koa = require('koa')

const app = new Koa()

app.use(async (ctx, next) => {
    await next()
    console.log('First middleware')
    ctx.body = 'Hello World, Haha'
})

app.use(async (ctx) => {
    console.log('Second middleware')
})

// 监听端口
app.listen(3001)