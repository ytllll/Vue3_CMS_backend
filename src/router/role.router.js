const Router = require('koa-router');

const {
  create,
  update,
  remove,
  list,
  getMenuByRoleId
} = require('../controller/role.controller');
const {
  verifyAuth
} = require('../middleware/auth.middleware');

const roleRouter = new Router({prefix: '/role'});

roleRouter.post('/', verifyAuth, create);
roleRouter.patch('/:roleId', verifyAuth, update);
roleRouter.delete('/:roleId', verifyAuth, remove);
roleRouter.post('/list', verifyAuth, list);
roleRouter.get('/:roleId/menu', verifyAuth, getMenuByRoleId);

module.exports = roleRouter;