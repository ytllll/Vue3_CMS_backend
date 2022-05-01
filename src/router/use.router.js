const Router = require('koa-router');

const {
  create,
  userInfo,
  list,
  update,
  remove,
  avatarInfo
} = require('../controller/user.controller');
const {
  verifyUser, 
  handlePassword
} = require('../middleware/user.middleware');
const {
  verifyAuth
} = require('../middleware/auth.middleware');


const userRouter = new Router({prefix: '/users'});

userRouter.post('/', verifyUser, handlePassword, create);
userRouter.get('/:userId', verifyAuth, userInfo);
userRouter.post('/list', verifyAuth, list);
userRouter.patch('/:userId', verifyAuth, handlePassword, update);
userRouter.delete('/:userId', verifyAuth, remove);

userRouter.get('/:userId/avatar/:avatarId', avatarInfo);

module.exports = userRouter;