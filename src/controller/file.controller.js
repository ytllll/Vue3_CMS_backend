const fileService = require('../service/file.service');
const userService = require('../service/user.service');
const storyServive = require('../service/story.service');
const { APP_HOST, APP_PORT } = require('../app/config');

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1.获取图像相关的信息
      const { filename, mimetype, size } = ctx.req.file;
      const { id } = ctx.user;

      // 2.将图像信息数据保存到数据库中
      await fileService.removeAvatar(id);
      const result = await fileService.createAvatar(filename, mimetype, size, id);
      const avatarId = result.insertId;
      // 3.将图片地址保存到user表中
      const avatarUrl = `http://${APP_HOST}:${APP_PORT}/users/${id}/avatar/${avatarId}`;
      await userService.updateAvatarUrlById(avatarUrl, id);

      ctx.body = {
        code: 200,
        text: "上传头像成功~",
        data: result
      };
  }

  async saveCoverInfo(ctx, next) {
    // 1.获取图像相关的信息
      const { filename, mimetype, size } = ctx.req.file;
      const { storyId } = ctx.req.body;

      // 2.将图像信息数据保存到数据库中
      await fileService.removeCover(storyId);
      const result = await fileService.createCover(filename, mimetype, size, storyId);
      const coverId = result.insertId;
      // 3.将图片地址保存到story表中
      const avatarUrl = `http://${APP_HOST}:${APP_PORT}/story/${storyId}/cover/${coverId}`;
      await storyServive.updateCoverUrlById(avatarUrl, storyId);

      ctx.body = {
        code: 200,
        text: "上传封面成功~",
        data: result
      };
  }

  async savePictureInfo(ctx, next) {
    // 1.获取图像信息
    const { filename, mimetype, size } = ctx.req.file;

    // 2.将图像信息保存到数据库中
    const result = await fileService.createFile(filename, mimetype, size);

    ctx.body = {
      code: 200,
      text: "图片上传完成~",
      data: result
    };
  }
}

module.exports = new FileController();