const connection = require('../app/database');

class CategoryService {
  async getCategoryList(offset, size) {
    const statement1 = `
    SELECT gc.id, gc.name, gc.goodsCount, gc.goodsSale, gc.goodsFavor, gc.createAt, gc.updateAt
    FROM goods_category gc LIMIT ?, ?;
    `;
    const [list] = await connection.execute(statement1, [offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM goods_category;`;
    const [totalCount] = await connection.execute(statement2)
    return {
      list,
      totalCount: totalCount[0].count
    };
  }
  
  async getCategoryListByInfo(name, createStart, createEnd, offset, size) {
    const statement1 = `
    SELECT gc.id, gc.name, gc.goodsCount, gc.goodsSale, gc.goodsFavor, gc.createAt, gc.updateAt
    FROM goods_category gc WHERE gc.name LIKE CONCAT('%', ?, '%') AND gc.createAt >= ? AND gc.createAt <= ? LIMIT ?, ?;
    `;
    const [list] = await connection.execute(statement1, [name, createStart, createEnd, offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM goods_category gc WHERE gc.name LIKE CONCAT('%', ?, '%') AND gc.createAt >= ? AND gc.createAt <= ?;`;
    const [totalCount] = await connection.execute(statement2, [name, createStart, createEnd])
    return {
      list,
      totalCount: totalCount[0].count
    };
  }

  async create(name, goodsCount=0, goodsSale=0, goodsFavor=0) {
    const statement = `INSERT INTO goods_category (name, goodsCount, goodsSale, goodsFavor) VALUES (?,?,?,?);`;
    const [result] = await connection.execute(statement, [name, goodsCount, goodsSale, goodsFavor]);
    return result;
  }

  async update(name, goodsCount=0, goodsSale=0, goodsFavor=0, categoryId) {
    const statement = `UPDATE goods_category SET name=?, goodsCount=?, goodsSale=?, goodsFavor=? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [name, goodsCount, goodsSale, goodsFavor, categoryId]);
    return result;
  }

  async remove(categoryId) {
    const statement = `DELETE FROM goods_category WHERE id = ?;`;
    const [result] = await connection.execute(statement, [categoryId]);
    return result;
  }
}

module.exports = new CategoryService();