const fs = require('fs');

const goodsService = require('../service/goods.service');
const fileService = require('../service/file.service');

const { PICTURE_PATH } = require('../constants/file-path');

class GoodsController {
  async create(ctx, next) {
    const { name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, imageId } = ctx.request.body;
    const result = await goodsService.create(name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, imageId);
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async update(ctx, next) {
    const { name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, imageId } = ctx.request.body;
    const { goodId } = ctx.params;
    if(imageId) {
      await goodsService.update(name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, goodId, imageId);
    } else {
      await goodsService.update(name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, goodId);
    }
    ctx.body = {
      code: 200,
      data: "更新商品成功"
    }
  }

  async remove(ctx, next) {
    const { goodId, imageId } = ctx.params;
    const result = await goodsService.remove(goodId, imageId);
    ctx.body = {
      code: 200,
      data: "删除商品成功"
    }
  }

  async goodsList(ctx, next) {
    let { name, address, enable, createAt } = ctx.request.body;
    const { offset, size } = ctx.request.body;
    let result;
    if(name || address || enable || createAt) {
      if(!name) name = '';
      if(!address) address = '';
      if(!enable) enable = 1;
      if(!createAt) {
        createAt = new Array();
        createAt[0] = '1900-01-01 00:00:00';
        const time = new Date();
        createAt[1] = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      }
      result = await goodsService.getGoodsListByInfo(name, address, enable, createAt[0], createAt[1], offset, size);
    } else {
      result = await goodsService.getGoodsList(offset, size);
    }
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async imageInfo(ctx, next) {
    const { filename } = ctx.params;
    const result = await fileService.getImageInfo(filename);

    ctx.response.set('content-type', result.mimetype); // 设置响应类型  让网页请求到的是一个图片 而不是下载文件
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${result.filename}`);
  }
  
  async amountList(ctx, next) {
    const result = await goodsService.getAmountList();
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async countList(ctx, next) {
    const result = await goodsService.getCountList();
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async saleList(ctx, next) {
    const result = await goodsService.getSaleList();
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async favorList(ctx, next) {
    const result = await goodsService.getFavorList();
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async addressList(ctx, next) {
    const result = await goodsService.getAddressList();
    ctx.body = {
      code: 200,
      data: result
    }
  }
}

module.exports = new GoodsController();