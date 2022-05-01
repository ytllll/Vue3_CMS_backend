const Router = require('koa-router');

const {
  verifyAuth
} = require('../middleware/auth.middleware');
const {
  categoryList,
  create,
  update,
  remove
} = require('../controller/category.controller');

const categoryRouter = new Router({prefix: '/category'});

categoryRouter.post('/list', verifyAuth, categoryList);
categoryRouter.post('/', verifyAuth, create);
categoryRouter.patch('/:categoryId', verifyAuth, update);
categoryRouter.delete('/:categoryId', verifyAuth, remove);

module.exports = categoryRouter;