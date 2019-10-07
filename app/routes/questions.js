const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update,
  del,
  checkQuestionExist,
  checkQuestioner
} = require('../controllers/questions')
const { auth } = require('../auth')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/questions' })

// 路由调用控制器
router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkQuestionExist, findById)
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del)
 
module.exports = router


