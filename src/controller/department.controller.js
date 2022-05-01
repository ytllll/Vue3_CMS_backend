const departmentService = require('../service/department.service');

class DepartmentController {
  async create(ctx, next) {
    const { name, parentId, leader} = ctx.request.body;
    const result = await departmentService.create(name, parentId, leader);
    ctx.body = {
      code: 200,
      data: "创建部门成功~"
    }
  }

  async update(ctx, next) {
    const { departmentId } = ctx.params;
    const { name, leader, parentId } = ctx.request.body;
    const result = await departmentService.update(departmentId, name, leader, parentId);
    ctx.body = {
      code: 200,
      data: "更新部门成功~"
    }
  }

  async remove(ctx, next) {
    const { departmentId } = ctx.params;
    const result = await departmentService.remove(departmentId);
    ctx.body = {
      code: 200,
      data: "删除部门成功~"
    }
  }

  async list(ctx, next) {
    // 1.获取请求数据
    let result;
    let { name, leader, createAt } = ctx.request.body;
    const { offset, size } = ctx.request.body;
    if(name || leader || createAt) {
      if(!name) name = '';
      if(!leader) leader = '';
      if(!createAt) {
        createAt = new Array();
        createAt[0] = '1900-01-01 00:00:00';
        const time = new Date();
        createAt[1] = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      }
      result = await departmentService.getDepartmentListByInfo(name, leader, createAt[0], createAt[1], offset, size);
    } else {
      result = await departmentService.getDepartmentList(offset, size);
    }
    
    ctx.body = {
      code: 200,
      data: result
    }
  }
}

module.exports = new DepartmentController();