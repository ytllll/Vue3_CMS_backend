const menuService = require('../service/menu.service');

class MenuController {
  async list(ctx, next) {
    const result = await menuService.getMenuList();
    ctx.body = {
      code: 200,
      data: {
        list: result
      }
    }
  }

  async create(ctx, next) {
    const { name, icon, type, url, parentId, permission } = ctx.request.body;
    // console.log(ctx.request.body)
    const result = await menuService.create(name, icon, type, url, parentId, permission);
    ctx.body = {
      code: 200,
      data: "创建菜单成功"
    }
  }

  async update(ctx, next) {
    const { menuId } = ctx.params; 
    const { name, icon, type, url, parentId, permission } = ctx.request.body;
    const result = await menuService.update(menuId, name, icon, type, url, parentId, permission);
    ctx.body = {
      code: 200,
      data: "更新菜单成功"
    }
  }

  async remove(ctx, next) {
    const { menuId } = ctx.params; 
    const result = await menuService.remove(menuId);
    ctx.body = {
      code: 200,
      data: "删除菜单成功"
    }
  }
}

module.exports = new MenuController();