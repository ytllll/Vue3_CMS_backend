const categoryService = require('../service/category.service');

class CategoryController {
  async categoryList(ctx, next) {
    let { name, createAt } = ctx.request.body
    const { offset, size } = ctx.request.body;
    let result;
    if(name || createAt) {
      if(!name) name = '';
      if(!createAt) {
        createAt = new Array();
        createAt[0] = '1900-01-01 00:00:00';
        const time = new Date();
        createAt[1] = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      }
      result = await categoryService.getCategoryListByInfo(name, createAt[0], createAt[1], offset, size);
    } else {
      result = await categoryService.getCategoryList(offset, size);
    }
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async create(ctx, next) {
    const { name, goodsCount, goodsSale, goodsFavor } = ctx.request.body;
    const result = await categoryService.create(name, goodsCount, goodsSale, goodsFavor);
    ctx.body = {
      code: 200,
      data: "创建类别成功~"
    }
  }

  async update(ctx, next) {
    const { categoryId } = ctx.params;
    const { name, goodsCount, goodsSale, goodsFavor } = ctx.request.body;
    const result = await categoryService.update(name, goodsCount, goodsSale, goodsFavor, categoryId);
    ctx.body = {
      code: 200,
      data: "更新类别成功~"
    }
  }

  async remove(ctx, next) {
    const { categoryId } = ctx.params;
    const result = await categoryService.remove(categoryId);
    ctx.body = {
      code: 200,
      data: "删除类别成功~"
    }
  }
}

module.exports = new CategoryController();