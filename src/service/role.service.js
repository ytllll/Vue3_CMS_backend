const connection = require('../app/database');
const menuService = require('../service/menu.service');

class RoleService {
  async create(name, intro, menuList) {
    const statement = `INSERT INTO role (name, intro) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [name, intro])
    console.log("创建角色成功", result)
    // 取到创建角色的id
    const roleId = result.insertId;
    console.log(roleId)
    for(let menuId of menuList) {
      const { type, parentId } = await menuService.getMenuById(menuId);
      console.log(roleId, menuId, type, parentId);
      const statement2 = `INSERT INTO role_menu (role_id, menu_id, type, parentId) VALUES (?,?,?,?);`;
      await connection.execute(statement2, [roleId, menuId, type, parentId]);
    }
    return result;
  }

  async update(roleId, name, intro, menuList) {
    // 1.更新role表
    const statement1 = `UPDATE role SET name = ?, intro = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement1, [name, intro, roleId]);
    // 2.删除role_menu表中当前id的权限关系
    const statement2 = `DELETE FROM role_menu WHERE role_id = ?;`;
    await connection.execute(statement2, [roleId]);
    // 3.重新插入新的权限关系
    for(let menuId of menuList) {
      const { type, parentId } = await menuService.getMenuById(menuId);
      const statement3 = `INSERT INTO role_menu (role_id, menu_id, type, parentId) VALUES (?,?,?,?);`;
      await connection.execute(statement3, [roleId, menuId, type, parentId]);
    }
    return result;
  }

  async remove(roleId) {
    const statement1 = `DELETE FROM role_menu WHERE role_id = ?;`;
    await connection.execute(statement1, [roleId]);
    const statement2 = `DELETE FROM role WHERE id = ?;`;
    const [result] = await connection.execute(statement2, [roleId]);
    
    return result;
  }

  async getRoleList(offset, size) {
    const statement1 = `
    SELECT r.id, r.name, r.intro, r.createAt, r.updateAt, (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
      JSON_OBJECT('id', m1.id, 'name', m1.name, 'icon', m1.icon, 'sort', m1.sort, 'type', m1.type, 'url', m1.url, 'children', (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
      JSON_OBJECT('id', m2.id, 'name', m2.name, 'parentId', m2.parentId, 'sort', m2.sort, 'type', m2.type, 'url', m2.url, 'children', (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
      JSON_OBJECT('id', m3.id, 'name', m3.name, 'parentId', m3.parentId, 'sort', m3.sort, 'type', m3.type, 'permission', m3.permission, 'url', m3.url)
    ), NULL) FROM role_menu rm LEFT JOIN menu m3 ON rm.menu_id = m3.id WHERE rm.role_id = r.id AND rm.type = 3 AND rm.parentId = m2.id))
    ), NULL) FROM role_menu rm LEFT JOIN menu m2 ON rm.menu_id = m2.id WHERE rm.role_id = r.id AND rm.type = 2 AND rm.parentId = m1.id))
    ), NULL) FROM role_menu rm LEFT JOIN menu m1 ON rm.menu_id = m1.id WHERE rm.role_id = r.id AND rm.type = 1) menuList
    FROM role r LIMIT ?, ?;
    `;
    const [list] = await connection.execute(statement1, [offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM role;`;
    const [totalCount] = await connection.execute(statement2)
    return {
      list,
      totalCount: totalCount[0].count
    };
  }
  
  async getRoleListByInfo(name, intro, createStart, createEnd, offset, size) {
    const statement1 = `
    SELECT r.id, r.name, r.intro, r.createAt, r.updateAt, 'menuList', (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
      JSON_OBJECT('id', m1.id, 'name', m1.name, 'icon', m1.icon, 'sort', m1.sort, 'type', m1.type, 'url', m1.url, 'children', (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
      JSON_OBJECT('id', m2.id, 'name', m2.name, 'parentId', m2.parentId, 'sort', m2.sort, 'type', m2.type, 'url', m2.url, 'children', (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
      JSON_OBJECT('id', m3.id, 'name', m3.name, 'parentId', m3.parentId, 'sort', m3.sort, 'type', m3.type, 'permission', m3.permission, 'url', m3.url)
    ), NULL) FROM role_menu rm LEFT JOIN menu m3 ON rm.menu_id = m3.id WHERE rm.role_id = r.id AND rm.type = 3 AND rm.parentId = m2.id))
    ), NULL) FROM role_menu rm LEFT JOIN menu m2 ON rm.menu_id = m2.id WHERE rm.role_id = r.id AND rm.type = 2 AND rm.parentId = m1.id))
    ), NULL) FROM role_menu rm LEFT JOIN menu m1 ON rm.menu_id = m1.id WHERE rm.role_id = r.id AND rm.type = 1)
    FROM role r WHERE r.name LIKE CONCAT('%', ?, '%') AND r.intro LIKE CONCAT('%', ?, '%') AND r.createAt >= ? AND r.createAt <= ? LIMIT ?, ?;
    `;
    const [list] = await connection.execute(statement1, [name, intro, createStart, createEnd, offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM role r WHERE r.name LIKE CONCAT('%', ?, '%') AND r.intro LIKE CONCAT('%', ?, '%') AND r.createAt >= ? AND r.createAt <= ?;`;
    const [totalCount] = await connection.execute(statement2, [name, intro, createStart, createEnd]);
    return {
      list,
      totalCount: totalCount[0].count
    };
  }

  async getMenuByRoleId(roleId) {
    const statement = `
    SELECT r.id id, r.name name, r.intro intro, r.createAt createAt, r.updateAt updateAt,
      (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
        JSON_OBJECT('id', m1.id, 'name', m1.name, 'icon', m1.icon, 'sort', m1.sort, 'type', m1.type, 'url', m1.url, 'children', (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
        JSON_OBJECT('id', m2.id, 'name', m2.name, 'parentId', m2.parentId, 'sort', m2.sort, 'type', m2.type, 'url', m2.url, 'children', (SELECT IF(COUNT(r.id = rm.role_id), JSON_ARRAYAGG(
        JSON_OBJECT('id', m3.id, 'name', m3.name, 'parentId', m3.parentId, 'sort', m3.sort, 'type', m3.type, 'permission', m3.permission, 'url', m3.url)
      ), NULL) FROM role_menu rm LEFT JOIN menu m3 ON rm.menu_id = m3.id WHERE rm.role_id = r.id AND rm.type = 3 AND rm.parentId = m2.id))
      ), NULL) FROM role_menu rm LEFT JOIN menu m2 ON rm.menu_id = m2.id WHERE rm.role_id = r.id AND rm.type = 2 AND rm.parentId = m1.id))
      ), NULL) FROM role_menu rm LEFT JOIN menu m1 ON rm.menu_id = m1.id WHERE rm.role_id = r.id AND rm.type = 1) menuList
    FROM role r WHERE r.id = ?;
    `;
    const [result] = await connection.execute(statement, [roleId]);
    return result;
  }
}

module.exports = new RoleService();