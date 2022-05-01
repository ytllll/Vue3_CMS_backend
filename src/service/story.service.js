const connection = require('../app/database');

class StoryService {
  async create(title, intro, content, userId) {
    const statement = `INSERT INTO story (title, intro, content, user_id) VALUES (?,?,?,?);`;
    const [result] = await connection.execute(statement, [title, intro, content, userId]);
    return result;
  }

  async storyList(offset, size) {
    const statement = `
    SELECT s.id id, s.title title, s.intro intro, s.content content, s.favor favor, s.cover_url, cover_url, s.createAt createAt, s.updateAt updateAt, JSON_OBJECT('id', u.id, 'name', u.name) authorInfo
    FROM story s 
    LEFT JOIN user u on u.id = s.user_id
    LIMIT ?, ?;
    `;
    const [list] = await connection.execute(statement, [offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM story;`;
    const [totalCount] = await connection.execute(statement2);
    return {
      list,
      totalCount: totalCount[0].count
    }
  }

  async getStoryListByInfo(title, createStart, createEnd, offset, size) {
    try {
      const statement1 = `
      SELECT s.id id, s.title title, s.intro intro, s.content content, s.favor favor, s.cover_url, cover_url, s.createAt createAt, s.updateAt updateAt, JSON_OBJECT('id', u.id, 'name', u.name) authorInfo
      FROM story s 
      LEFT JOIN user u on u.id = s.user_id
      WHERE s.title LIKE CONCAT('%', ?, '%') AND s.createAt >= ? AND s.createAt <= ?
      LIMIT ?, ?;`
      const [list] = await connection.execute(statement1, [title, createStart, createEnd, offset+'', size+'']);
      const statement2 = `SELECT COUNT(*) count FROM story s WHERE s.title LIKE CONCAT('%', ?, '%') AND s.createAt >= ? AND s.createAt <= ?;`;
      const [totalCount] = await connection.execute(statement2, [title, createStart, createEnd]);
      return {
        list,
        totalCount: totalCount[0].count
      };
    } catch (error) {
      console.log(error)
    } 
  }

  async stroyMain(storyId) {
    const statement = `
    SELECT s.id id, s.title title, s.intro intro, s.content content, s.favor favor, s.createAt createAt, s.updateAt updateAt, JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) authorInfo
    FROM story s
    LEFT JOIN user u on u.id = s.user_id
    WHERE s.id = ?;`;
    const [result] = await connection.execute(statement, [storyId]);
    return result[0];
  }

  async updateCoverUrlById(cover_url, storyId) {
    const statement = `UPDATE story SET cover_url = ? WHERE id = ? ;`;
    const [result] = await connection.execute(statement, [cover_url, storyId]);

    return result;
  }
}

module.exports = new StoryService();