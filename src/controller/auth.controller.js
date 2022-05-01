const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../app/config')

class AuthController {
  async login(ctx, next) {
    const { id, name } = ctx.user;
    const token = jwt.sign({ id, name}, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: "RS256"
    });

    const nowTime = new Date().getTime();
    const overTime = nowTime + 60 * 60 * 24 * 1000

    ctx.body = {
      code: 200,
      data: { id, name, token, overTime }
    }
  }

  async success(ctx, next) {
    ctx.body = "授权成功";
  }
}

module.exports = new AuthController();