class HomeController {
  index(ctx) {
    ctx.body = 'main page'
  }

  upload(ctx) {
    
  }
}

module.exports = new HomeController()