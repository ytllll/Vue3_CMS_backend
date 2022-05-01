const connection = require('../app/database');

class CommentService {
  async create(storyId, content, userId) {
    const statement = `INSERT INTO comment (content, story_id, user_id) VALUES (?,?,?);`;
    const [result] = await connection.execute(statement, [content, storyId, userId]);
    return result;
  }

  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [commentId]);
    return result;
  }

  async reply(storyId, content, userId, commentId) {
    const statement = `INSERT INTO comment (content, story_id, user_id, comment_id) VALUES (?, ?, ?, ?);`;
    const [result] = await connection.execute(statement, [content, storyId, userId, commentId]);
    return result;
  }

  async getCommentsByStoryId(storyId) {
    const statement1 = `
    SELECT c.id, c.content, c.comment_id commentId, c.createAt createAt,
      JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) user
    FROM comment c
    LEFT JOIN user u ON u.id = c.user_id
    WHERE story_id = ?;`;
    const [list] = await connection.execute(statement1, [storyId]);
    const statement2 = `SELECT COUNT(*) count FROM comment WHERE story_id = ?;`;
    const [totalCount] = await connection.execute(statement2, [storyId]);
    return {
      list,
      totalCount: totalCount[0].count
    };
  }
}

module.exports = new CommentService();