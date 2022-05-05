const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');

const errorHandle = require('./error-handle');
const useRoutes = require('../router');

const app = new Koa();

// 关闭服务器跨域限制
app.use(cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    if (ctx.url === '/test') {
            return '*'; // 允许来自所有域名请求
    }
    return '*'; //只允许http://localhost:8080这个域名的请求
  }
}))

app.useRoutes = useRoutes;

app.use(bodyParser());
app.useRoutes(); // 动态注册路由函数
app.on('error', errorHandle);

module.exports = app;