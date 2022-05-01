const app = require('./app');
require('./app/database');

const config = require('./app/config');

app.listen(config.APP_PORT, () => {
  console.log(config.APP_PORT + '服务器启动成功');
})