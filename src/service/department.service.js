const connection = require('../app/database');

class DepartmentService {
  async create(name='', parentId=null, leader='') {
    const statement = `INSERT INTO department (name, leader, parentId) VALUES (?,?,?);`;
    const [result] = await connection.execute(statement, [name, leader, parentId]);
    return result;
  }

  async update(departmentId, name, leader, parentId) {
    const statement = `UPDATE department SET name = ?, leader = ?, parentId = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [name, leader, parentId, departmentId]);
    return result;
  }

  async remove(departmentId) {
    const statement = `DELETE FROM department WHERE id = ?;`;
    const [result] = await connection.execute(statement, [departmentId]);
    return result;
  }

  async getDepartmentList(offset, size) {
    const statement1 = `
    SELECT d.id, d.name, d.leader, d.parentId, d.createAt, d.updateAt
    FROM department d LIMIT ?, ?;
    `;
    // 如果不是采用的query方式，而是使用的body渠道的offset和size是数字类型，但是参数需要使用的是字符串类型
    const [list] = await connection.execute(statement1, [offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM department;`;
    const [totalCount] = await connection.execute(statement2);
    return {
      list,
      totalCount: totalCount[0].count
    };
  }

  async getDepartmentListByInfo(name, leader, createStart, createEnd, offset, size) {
    const statement1 = `
    SELECT d.id, d.name, d.leader, d.parentId, d.createAt, d.updateAt
    FROM department d WHERE d.name LIKE CONCAT('%', ?, '%') AND d.leader LIKE CONCAT('%', ?, '%') AND d.createAt >= ? AND d.createAt <= ? LIMIT ?, ?;
    `;
    const [list] = await connection.execute(statement1, [name, leader, createStart, createEnd, offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM department d WHERE d.name LIKE CONCAT('%', ?, '%') AND d.leader LIKE CONCAT('%', ?, '%') AND d.createAt >= ? AND d.createAt <= ?;`;
    const [totalCount] = await connection.execute(statement2, [name, leader, createStart, createEnd]);
    return {
      list,
      totalCount: totalCount[0].count
    };
  }
} 

module.exports = new DepartmentService();