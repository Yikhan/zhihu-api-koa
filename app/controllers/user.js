const db = [{ name: 'Li Lei' }]

class UserController {
  find(ctx) {
    // 可以使用set设置响应头
    ctx.set('Allow', 'GET, POST')
    ctx.body = db
  }

  findById(ctx) {
    // verification
    const index = parseInt(ctx.params.id)
    if (index >= db.length) {
      ctx.throw(412, 'Precondition fail: id exceeds boundary')
    }
    // logic
    ctx.body = db[index]
  }

  create(ctx) {
    // verification
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false }
    })
    // logic
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }

  update(ctx) {
    // verification
    const index = parseInt(ctx.params.id)
    if (index >= db.length) {
      ctx.throw(412, 'Precondition fail: id exceeds boundary')
    }
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false }
    })
    // logic
    db[index] = ctx.request.body
    ctx.body = ctx.request.body
  }

  del(ctx) {
    // verification
    const index = parseInt(ctx.params.id)
    if (index >= db.length) {
      ctx.throw(412, 'Precondition fail: id exceeds boundary')
    }
    // logic
    db.splice(index, 1)

    // 请求成功但无返回数据，使用204状态
    ctx.status = 204
  }
}

module.exports = new UserController()