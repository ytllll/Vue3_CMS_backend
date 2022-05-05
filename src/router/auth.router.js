const Router = require('koa-router');

const authRouter = new Router();

const {
  login,
  success,
  sendmsg,
  phoneLogin
} = require('../controller/auth.controller');
const {
  verifyLogin,
  verifyAuth,
  verifyPhoneLogin
} = require('../middleware/auth.middleware');

authRouter.post('/login', verifyLogin, login);
authRouter.get('/test', verifyAuth, success);
authRouter.post('/sendmsg', sendmsg);
authRouter.post('/phoneLogin', verifyPhoneLogin, phoneLogin);

module.exports = authRouter;