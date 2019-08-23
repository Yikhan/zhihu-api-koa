const Koa = require('koa')

const app = new Koa()

app.use(async (ctx, next) => {
    if (ctx.url === '/') {
        ctx.body = 'main page'
    } else if (ctx.url === '/users') {
        if (ctx.method === 'GET') {
            ctx.body = 'user list'
        } else if (ctx.method === 'POST') {
            ctx.body = 'create user'
        } else {
            //method not allowed
            ctx.status = 405 
        }
    } else if (ctx.url.match(/\/users\/\w+/)) {
        // parameter extraction
        const userId = ctx.url.match(/\/users\/(\w+)/)[1]
        ctx.body = `this is user: ${userId}`
    } else {
        ctx.status = 404
    }
})

// 监听端口
app.listen(3001)