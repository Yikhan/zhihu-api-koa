const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update, 
  del, 
  login, 
  checkOwner, 
  listFollowing,
  listFollowers,
  follow,
  unfollow,
  checkUserExist
} = require('../controllers/users')
const { auth } = require('../auth')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/users' })

// 路由调用控制器
router.get('/', find)

router.get('/:id', findById)

router.get('/:id/following', listFollowing)

router.get('/:id/followers', listFollowers)

router.put('/follow/:id', auth, checkUserExist, follow)

router.delete('/follow/:id', auth, checkUserExist, unfollow)

router.post('/', create)

router.post('/login', login)

router.patch('/:id', auth, checkOwner, update)

router.delete('/:id', auth, checkOwner, del)

module.exports = router


