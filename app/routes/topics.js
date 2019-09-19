const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update, 
} = require('../controllers/topics')
const { auth } = require('../auth')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/topics' })

// 路由调用控制器
router.get('/', find)

router.post('/', auth, create)

router.get('/:id', findById)

router.patch('/:id', auth, update)

module.exports = router


