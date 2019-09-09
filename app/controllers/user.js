const db = [{ name: 'Li Lei' }]

class UserController {
  find(ctx) {
    // 可以使用set设置响应头
    ctx.set('Allow', 'GET, POST')
    ctx.body = db
  }

  findById(ctx) {
    ctx.body = db[parseInt(ctx.params.id)]
  }

  create(ctx) {
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }

  update(ctx) {
    const index = parseInt(ctx.params.id)
    db[index] = ctx.request.body
    ctx.body = ctx.request.body
  }

  del(ctx) {
    const index = parseInt(ctx.params.id)
    db.splice(index, 1)
    // 请求成功但无返回数据，使用204状态
    ctx.status = 204
  }
}

module.exports = new UserController()