const Router = require('koa-router');

const { 
  create,
  storyList,
  storyMain,
  coverInfo
} = require('../controller/story.controller');
const {
  verifyAuth
} = require('../middleware/auth.middleware');

const storyRouter = new Router({prefix: '/story'});

storyRouter.post('/', verifyAuth, create);
storyRouter.post('/list', verifyAuth, storyList);
storyRouter.get('/list/main/:storyId', verifyAuth, storyMain);

storyRouter.get('/:storyId/cover/:coverId', coverInfo);

module.exports = storyRouter;