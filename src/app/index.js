const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const errorHandle = require('./error-handle');
const useRoutes = require('../router');

const app = new Koa();

app.useRoutes = useRoutes;

app.use(bodyParser());
app.useRoutes(); // 动态注册路由函数
app.on('error', errorHandle);

module.exports = app;