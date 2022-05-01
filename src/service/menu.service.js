const connection = require('../app/database');

class MenuService {
  async getMenuList() {
    const statement = `
    SELECT m1.id id, m1.name name, m1.sort sort, m1.type type, m1.icon icon, m1.url url, m1.createAt createAt, m1.updateAt updateAt,
      (SELECT IF(COUNT(m2.parentId = m1.id), JSON_ARRAYAGG(
        JSON_OBJECT('id', m2.id, 'name', m2.name, 'parentId', m2.parentId, 'sort', m2.sort, 'type', m2.type, 'url', m2.url, 'createAt', m2.createAt, 'updateAt', m2.updateAt, 
        'children', (SELECT IF(COUNT(m3.parentId = m2.id), 
          JSON_ARRAYAGG(
            JSON_OBJECT('id', m3.id, 'name', m3.name, 'parentId', m3.parentId, 'permission', m3.permission, 'sort', m3.sort, 'type', m3.type, 'url', m3.url, 'createAt', m3.createAt, 'updateAt', m3.updateAt)), NULL) 
              FROM menu m3 WHERE m3.type = 3 AND m3.parentId = m2.id)
          )
      ), NULL) FROM menu m2 WHERE m2.type = 2 AND m2.parentId = m1.id) children
    FROM menu m1
    WHERE type = 1;
    `;
    const [result] = await connection.execute(statement);
    return result;
  }

  async getMenuById(menuId) {
    const statement = `SELECT * FROM menu WHERE id = ?;`;
    const [result] = await connection.execute(statement, [menuId]);
    return result[0];
  }

  async create(name='', icon='', type, url='', parentId, permission='') {
    if(parentId) {
      const statement = `INSERT INTO menu (name, icon, type, url, parentId, permission) VALUES (?,?,?,?,?,?);`;
      const [result] = await connection.execute(statement, [name, icon, type, url, parentId, permission]);
      return result;
    } else {
      const statement = `INSERT INTO menu (name, icon, type, url, permission) VALUES (?,?,?,?,?);`;
      const [result] = await connection.execute(statement, [name, icon, type, url, permission]);
      return result;
    }
  }

  async update(menuId, name='', icon='', type, url='', parentId='', permission='') {
    console.log(menuId)
    const statement = `UPDATE menu SET name = ?, icon = ?, type = ?, url = ?, parentId = ?, permission = ?  WHERE id = ?;`;
    const [result] = await connection.execute(statement, [name, icon, type, url, parentId, permission, menuId]);
    return result;
  }

  async remove(menuId) {
    const statement = `DELETE FROM menu WHERE id = ?;`;
    const [result] = await connection.execute(statement, [menuId]);
    return result;
  }
}

module.exports = new MenuService();