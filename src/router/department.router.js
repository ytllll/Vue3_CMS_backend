const Router = require('koa-router');

const {
  create,
  update,
  remove,
  list
} = require('../controller/department.controller');
const {
  verifyAuth
} = require('../middleware/auth.middleware');

const departmentRouter = new Router({prefix: '/department'});

departmentRouter.post('/', verifyAuth, create);
departmentRouter.patch('/:departmentId', verifyAuth, update);
departmentRouter.delete('/:departmentId', verifyAuth, remove);
departmentRouter.post('/list', verifyAuth, list);

module.exports = departmentRouter;