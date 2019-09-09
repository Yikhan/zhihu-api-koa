class HomeController {
  index(ctx) {
    ctx.body = 'main page'
  }
}

module.exports = new HomeController()