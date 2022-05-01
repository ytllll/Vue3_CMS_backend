const errorType = require('../constants/error-types');
const service = require('../service/user.service');
const md5password = require('../utils/password-handle');

const verifyUser = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;
  // 2.判断用户名或者密码不能为空
  if(!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }

  // 3.判断这次注册的用户名是没有被注册过的
  const result = await service.getUserByName(name);
  if(result.length) {
    const error = new Error(errorType.USER_ALREADY_IS_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  await next();
}

// 密码加密存入数据库
const handlePassword = async (ctx, next) => {
  let { password } = ctx.request.body;
  let { oldPassword, newPassword1, newPassword2 } = ctx.request.body;
  if(password) {
    ctx.request.body.password = md5password(password);
  } else if (oldPassword || newPassword1 || newPassword2) {
    ctx.request.body.oldPassword = md5password(oldPassword);
    ctx.request.body.newPassword1 = md5password(newPassword1);
    ctx.request.body.newPassword2 = md5password(newPassword2);
  } else {
    console.log("next")
  }
  
  await next();
}

module.exports = {
  verifyUser,
  handlePassword
}