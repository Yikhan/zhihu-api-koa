const fs = require('fs')

// 自动化注册所有的路由中间件
// 避免挨个写app.use()
module.exports = (app) => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') { return }
    
    const route = require(`./${file}`)
    // allowMethods 允许使用options请求返回允许的方法
    // 自动返回405当收到未允许的方法请求时
    app.use(route.routes()).use(route.allowedMethods())
    console.log(`register route: ${file}`)
  })
}