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
// 列出一个回答下所有的评论
router.get('/', find)
// 创建新评论
router.post('/', auth, create)
// 根据评论id查找
router.get('/:id', checkCommentExist, findById)
// 修改评论 - 1.用户登录鉴权 2.评论必须存在 3.评论的创建者必须是当前用户自己，否则不能修改
router.patch('/:id', auth, checkCommentExist, checkCommenter, update)
// 删除评论 - 鉴权和修改评论时一样
router.delete('/:id', auth, checkCommentExist, checkCommenter, del)
 
module.exports = router
