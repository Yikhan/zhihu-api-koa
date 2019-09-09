const Router = require('koa-router')
const { find, findById, create, update, del} = require('../controllers/user')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/users' })

// 路由调用控制器
router.get('/', find)

router.get('/:id', findById)

router.post('/', create)

router.put('/:id', update)

router.delete('/:id', del)

module.exports = router


