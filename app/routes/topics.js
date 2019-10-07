const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update,
  listTopicFollowers,
  checkTopicExist
} = require('../controllers/topics')
const { auth } = require('../auth')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/topics' })

// 路由调用控制器
router.get('/', find)

router.post('/', auth, create)

router.get('/:id', checkTopicExist, findById)

router.patch('/:id', auth, checkTopicExist, update)

router.get('/:id/followers', checkTopicExist, listTopicFollowers)


module.exports = router


