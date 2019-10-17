const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update,
  del,
  checkCommentExist,
  checkCommenter
} = require('../controllers/comments')
const { auth } = require('../auth')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' })

// 路由调用控制器
router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkCommentExist, findById)
router.patch('/:id', auth, checkCommentExist, checkCommenter, update)
router.delete('/:id', auth, checkCommentExist, checkCommenter, del)
 
module.exports = router
