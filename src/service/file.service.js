const connection = require('../app/database');

class FileService {
  async createAvatar(filename, mimetype, size, userId) {
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?,?,?,?);`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, userId]);
    return result;
  }

  async removeAvatar(userId) {
    const statement = `DELETE FROM avatar WHERE user_id = ?;`;
    await connection.execute(statement, [userId]);
  }

  async getAvatarByUserId(userId) {
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
    const [result] = await connection.execute(statement, [userId]);
    return result[0];
  }

  async createCover(filename, mimetype, size, storyId) {
    const statement = `INSERT INTO cover (filename, mimetype, size, story_id) VALUES (?,?,?,?);`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, storyId]);
    return result;
  }

  async removeCover(storyId) {
    const statement = `DELETE FROM cover WHERE story_id = ?;`;
    await connection.execute(statement, [storyId]);
  }

  async getCoverByStoryId(storyId) {
    const statement = `SELECT * FROM cover WHERE story_id = ?;`;
    const [result] = await connection.execute(statement, [storyId]);
    return result[0];
  }

  async createFile(filename, mimetype, size) {
    const statement = `INSERT INTO good_picture (filename, mimetype, size) VALUES (?,?,?);`;
    const [result] = await connection.execute(statement, [filename, mimetype, size]);
    return result;
  }

  async getImageInfo(filename) {
    const statement = `SELECT * FROM good_picture gp WHERE gp.filename = ?;`;
    const [result] = await connection.execute(statement, [filename]);
    return result[0];
  }
}

module.exports = new FileService();