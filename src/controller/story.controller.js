const fs = require('fs');

const storyService = require('../service/story.service');
const fileService = require('../service/file.service');

const { COVER_PATH } = require('../constants/file-path');

class StoryController {
  async create(ctx, next) {
    const { title, intro, content, userId } = ctx.request.body;
    const result = await storyService.create(title, intro, content, userId);
    ctx.body = {
      code: 200,
      text: "发布故事成功~",
      data: result
    }
  }

  async storyList(ctx, next) {
    let { title, createAt } = ctx.request.body;
    const { offset, size } = ctx.request.body;
    let result;
    if(title || createAt) {
      if(!title) title = '';
      if(!createAt) {
        createAt = new Array();
        createAt[0] = '1900-01-01 00:00:00';
        const time = new Date();
        createAt[1] = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      }
      result = await storyService.getStoryListByInfo(title, createAt[0], createAt[1], offset, size);
    } else {
      result = await storyService.storyList(offset, size);
    }
    
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async storyMain(ctx, next) {
    const { storyId } = ctx.params;
    const result = await storyService.stroyMain(storyId);
    ctx.body = {
      code: 200,
      data: result
    }
  }

  async coverInfo(ctx, next) {
    // 1.获取用户头像信息
    const { storyId } = ctx.params;
    const coverInfo = await fileService.getCoverByStoryId(storyId);

    // 2.提供图像信息
    ctx.response.set('content-type', coverInfo.mimetype); // 设置响应类型  让网页请求到的是一个图片 而不是下载文件
    ctx.body = fs.createReadStream(`${COVER_PATH}/${coverInfo.filename}`); 
  }
}

module.exports = new StoryController();