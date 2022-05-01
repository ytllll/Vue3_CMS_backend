const roleService = require('../service/role.service');

class RoleController {
  async create(ctx, next) {
    const { name, intro, menuList } = ctx.request.body;
    const result = await roleService.create(name, intro, menuList);
    ctx.body = {
      code: 200, 
      data: "创建角色成功~"
    }
  }

  async update(ctx, next) {
    const { roleId } = ctx.params;
    const { name, intro, menuList } = ctx.request.body;
    const result = await roleService.update(roleId, name, intro, menuList);
    ctx.body = {
      code: 200, 
      data: "更新角色成功~"
    }
  }

  async remove(ctx, next) {
    const { roleId } = ctx.params;
    const result = await roleService.remove(roleId);
    ctx.body = {
      code: 200,  
      data: "删除角色成功~"
    }
  }

  async list(ctx, next) {
    let { name, intro, createTime } = ctx.request.body;
    const { offset, size } = ctx.request.body;
    let result;
    if(name || intro || createTime) {
      if(!name) name = '';
      if(!intro) intro = '';
      if(!createTime) {
        createTime = new Array();
        createTime[0] = '1900-01-01 00:00:00';
        const time = new Date();
        createTime[1] = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      }
      result = await roleService.getRoleListByInfo(name, intro, createTime[0], createTime[1], offset, size);
    } else {
      result = await roleService.getRoleList(offset, size);
    }
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async getMenuByRoleId(ctx, next) {
    const { roleId } = ctx.request.params;
    const result = await roleService.getMenuByRoleId(roleId);
    ctx.body = {
      code: 200, 
      data: result[0].menuList
    }
  }
}

module.exports = new RoleController();