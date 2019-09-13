const path = require('path')

class HomeController {
  index(ctx) {
    ctx.body = 'main page'
  }

  upload(ctx) {
    const file = ctx.request.files.file // file这个对象名字是在请求里面用key-value设定好的
    const basename = path.basename(file.path)
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` }
  }
}

module.exports = new HomeController()