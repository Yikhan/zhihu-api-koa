const Router = require('koa-router')
const { find, findById, create, update, del, login } = require('../controllers/user')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/users' })

// 路由调用控制器
router.get('/', find)

router.get('/:id', findById)

router.post('/', create)

router.patch('/:id', update)

router.delete('/:id', del)

router.post('/login', login)

module.exports = router


