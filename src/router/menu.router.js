const Router = require('koa-router');

const {
  list,
  create,
  update,
  remove
} = require('../controller/menu.controller');
const {
  verifyAuth
} = require('../middleware/auth.middleware');

const menuRouter = new Router({prefix: '/menu'});

menuRouter.post('/list', verifyAuth, list);
menuRouter.post('/', verifyAuth, create);
menuRouter.patch('/:menuId', verifyAuth, update);
menuRouter.delete('/:menuId', verifyAuth, remove);

module.exports = menuRouter;