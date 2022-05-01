const connection = require('../app/database');

class UserService {
  async create(user) {
    const { name, password, realname, cellphone, roleId, departmentId } = user;
    const statement = `INSERT INTO user (name, password, realname, cellphone, role_id, department_id) VALUES (?,?,?,?,?,?);`;
    const result = await connection.execute(statement, [name, password, realname, cellphone, roleId, departmentId]);
    return result[0];
  }

  async getUserByName(name) {
    const statement = `SELECT * FROM user WHERE name = ?;`;
    const result = await connection.execute(statement, [name]);
    return result[0];
  }

  async getUserById(userId) {
    const statement = `
    SELECT u.id id, u.name name, u.realname realname, u.cellphone cellphone, u.enable enable, u.avatar_url avatar_url,
      JSON_OBJECT('id', r.id, 'name', r.name, 'intro', r.intro, 'createAt', r.createAt, 'updateAt', r.updateAt) role,
      JSON_OBJECT('id', d.id, 'name', d.name, 'leader', d.leader, 'parentId', d.parentId, 'createAt', d.createAt, 'updateAt', d.updateAt) department,
      u.createAt createAt, u.updateAt updateAt
    FROM user u 
    LEFT JOIN role r ON u.role_id = r.id
    LEFT JOIN department d ON u.department_id = d.id
    WHERE u.id = ?;
    `;
    const [result] = await connection.execute(statement, [userId]);
    return result[0];
  }

  async getUserListByInfo(name, realname, cellphone, enable, createStart, createEnd, offset, size) {
    const statement1 = `
    SELECT u.id, u.name, u.realname, u.cellphone, u.enable, u.role_id roleId, u.department_id departmentId, u.createAt, u.updateAt
    FROM user u WHERE u.name LIKE CONCAT('%', ?, '%') AND u.realname LIKE CONCAT('%', ?, '%') AND u.cellphone LIKE CONCAT('%', ?, '%') AND u.enable = ? AND u.createAt >= ? AND u.createAt <= ? LIMIT ?, ?;
    `;
    const [list] = await connection.execute(statement1, [name, realname, cellphone, enable, createStart, createEnd, offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM user u WHERE u.name LIKE CONCAT('%', ?, '%') AND u.realname LIKE CONCAT('%', ?, '%') AND u.cellphone LIKE CONCAT('%', ?, '%') AND u.enable = ? AND u.createAt >= ? AND u.createAt <= ?;`;
    const [totalCount] = await connection.execute(statement2, [name, realname, cellphone, enable, createStart, createEnd]);
    return {
      list,
      totalCount: totalCount[0].count
    };
  }
  
  async getUserList(offset, size) {
    const statement1 = `
    SELECT u.id, u.name, u.realname, u.cellphone, u.enable, u.role_id roleId, u.department_id departmentId, u.createAt, u.updateAt
    FROM user u LIMIT ?, ?;
    `;
    const [list] = await connection.execute(statement1, [offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM user;`;
    const [totalCount] = await connection.execute(statement2);
    return {
      list,
      totalCount: totalCount[0].count
    };
  }

  async update(name, realname, cellphone, roleId, departmentId, userId) {
    try {
      const statement = `UPDATE user SET name = ?, realname = ?, cellphone = ?, role_id = ?, department_id = ? WHERE id = ?;`;
      const [result] = await connection.execute(statement, [name, realname, cellphone, roleId, departmentId, userId]);
      return !!result ? true : false;
    } catch (error) {
      console.log(error)
    }
  }

  async updatePassword(oldPassword, newPassword1, newPassword2, userId) {
    if(newPassword1 !== newPassword2) {
      return false
    }
    const statement = `UPDATE user SET password = ? WHERE id = ? AND password = ?`;
    const [result] = await connection.execute(statement, [newPassword1, userId, oldPassword]);
    return !!result ? true : false;
  }

  async remove(userId) {
    const statement = `DELETE FROM user WHERE id = ?;`;
    const [result] = await connection.execute(statement, [userId]);
    return !!result ? true : false;
  }

  async updateAvatarUrlById(avatar_url, userId) {
    const statement = `UPDATE user SET avatar_url = ? WHERE id = ? ;`;
    const [result] = await connection.execute(statement, [avatar_url, userId]);

    return result;
  }
}

module.exports = new UserService();