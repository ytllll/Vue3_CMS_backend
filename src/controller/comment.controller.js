const commentService = require('../service/comment.service');

class CommentController {
  async create(ctx, next) {
    const { storyId, content } = ctx.request.body;
    const { id } = ctx.user;
    const result = await commentService.create(storyId, content, id);
    ctx.body = {
      code: 200,
      text: "发布评论成功",
      data: result
    };
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params;
    const result = await commentService.remove(commentId);
    ctx.body = {
      code: 200,
      text: "删除评论成功",
      data: result
    }
  }

  async reply(ctx, next) {
    const { storyId, content } = ctx.request.body;
    const { commentId } = ctx.params;
    const { id } = ctx.user;
    const result = await commentService.reply(storyId, content, id, commentId);
    ctx.body = {
      code: 200,
      text: "回复评论成功",
      data: result
    };
  }

  async list(ctx, next) {
    const { storyId } = ctx.query;
    const result = await commentService.getCommentsByStoryId(storyId);
    ctx.body = {
      code: 200,
      data: {
        list: result.list,
        totalCount: result.totalCount
      }
    };
  }
}

module.exports = new CommentController();