const Router = require('koa-router');

const {
  verifyAuth
} = require('../middleware/auth.middleware');
const {
  create,
  update,
  remove,
  goodsList,
  amountList,
  countList,
  saleList,
  favorList,
  addressList,
  imageInfo
} = require('../controller/goods.controller');

const goodsRouter = new Router({prefix: '/goods'});

goodsRouter.post('/', verifyAuth, create);
goodsRouter.post('/list', verifyAuth, goodsList);
goodsRouter.patch('/:goodId', verifyAuth, update);
goodsRouter.delete('/:goodId/:imageId', verifyAuth, remove);

goodsRouter.get('/image/:filename', imageInfo);

goodsRouter.get('/amount/list', verifyAuth, amountList);
goodsRouter.get('/category/count', verifyAuth, countList);
goodsRouter.get('/category/sale', verifyAuth, saleList);
goodsRouter.get('/category/favor', verifyAuth, favorList);
goodsRouter.get('/address/sale', verifyAuth, addressList);

module.exports = goodsRouter;