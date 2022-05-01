const fs = require('fs');

const userService = require('../service/user.service');
const fileService = require('../service/file.service');
const { AVATAR_PATH } = require('../constants/file-path');

class UserController {
  async create(ctx, next) {
    // 1.获取用户请求传递的参数
    const user = ctx.request.body;

    // 2.查询数据库
    const result = await userService.create(user);

    // 3.返回数据
    ctx.body = {
      code: 200,
      data: "创建用户成功~"
    };
  }

  async userInfo(ctx, next) {
    // 1.获取到用户id
    const { userId } = ctx.request.params;
    // 2.查询数据库
    const result = await userService.getUserById(userId);
    ctx.body = {
      code: 200, 
      data: result
    }
  }

  async list(ctx, next) {
    let { name, realname, cellphone, enable, createAt } = ctx.request.body;
    const { offset, size } = ctx.request.body;
    let result;
    if(name || realname || cellphone || enable || createAt) {
      if(!name) name = '';
      if(!realname) realname = '';
      if(!cellphone) cellphone = '';
      if(!enable) enable = 1;
      if(!createAt) {
        createAt = new Array();
        createAt[0] = '1900-01-01 00:00:00';
        const time = new Date();
        createAt[1] = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      }
      result = await userService.getUserListByInfo(name, realname, cellphone, enable, createAt[0], createAt[1], offset, size)
    } else {
      result = await userService.getUserList(offset, size);
    }
    ctx.body = {
      code: 200, 
      data: result
    }
  }

  async update(ctx, next) {
    // 1.获取修改的用户信息id
    const { userId } = ctx.params;
    // 2.获取修改的信息
    const { name, realname, cellphone, roleId, departmentId } = ctx.request.body;
    console.log(name, realname, cellphone, roleId, departmentId)
    const { oldPassword, newPassword1, newPassword2 } = ctx.request.body;
    // 3.修改数据库内容
    if(oldPassword || newPassword1 || newPassword2) {
      const result = await userService.updatePassword(oldPassword, newPassword1, newPassword2, userId);
      if(result) {
        ctx.body = {
          code: 200,
          data: "修改密码成功~"
        }
      } else {
        ctx.body = {
          code: 0,
          data: "修改密码失败~"
        }
      }
    } else {
      const result = await userService.update(name, realname, cellphone, roleId, departmentId, userId);
      if(result) {
        ctx.body = {
          code: 200,
          data: "修改用户成功~"
        }
      } else {
        ctx.body = {
          code: 0,
          data: "修改用户失败~"
        }
      }
    }
  }

  async remove(ctx, next) {
    // 1.获取删除的用户信息id
    const { userId } = ctx.params;
    // 3.修改数据库内容
    const result = await userService.remove(userId);
    if(result) {
      ctx.body = {
        code: 200,
        data: "删除用户成功~"
      }
    } else {
      ctx.body = {
        code: 0,
        data: "删除用户失败~"
      }
    }
  }

  async avatarInfo(ctx, next) {
    // 1.获取用户头像信息
    const { userId } = ctx.params;
    const avatarInfo = await fileService.getAvatarByUserId(userId);

    // 2.提供图像信息
    ctx.response.set('content-type', avatarInfo.mimetype); // 设置响应类型  让网页请求到的是一个图片 而不是下载文件
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`); 
  }
}

module.exports = new UserController();