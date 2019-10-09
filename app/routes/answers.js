const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update,
  del,
  checkAnswerExist,
  checkAnswerer
} = require('../controllers/answers')
const { auth } = require('../auth')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/questions/:questionId/answers' })

// 路由调用控制器
router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkAnswerExist, findById)
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update)
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del)
 
module.exports = router
