const Router = require('koa-router');

const {
  verifyAuth
} = require('../middleware/auth.middleware');
const {
  avatarHandler,
  coverHandler,
  pictureHandler
} = require('../middleware/file.middleware');
const {
  saveAvatarInfo,
  saveCoverInfo,
  savePictureInfo
} = require('../controller/file.controller')

const fileRouter = new Router({prefix: '/file'});

fileRouter.post('/avatar', verifyAuth, avatarHandler, saveAvatarInfo);
fileRouter.post('/cover', verifyAuth, coverHandler, saveCoverInfo);
fileRouter.post('/picture', pictureHandler, savePictureInfo);

module.exports = fileRouter;

