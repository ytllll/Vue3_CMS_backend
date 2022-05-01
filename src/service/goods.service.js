const connection = require('../app/database');

class GoodsService {
  async create(name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, imageId) {
    let result; 
    if(imageId) {
      const statement = `INSERT INTO goods (name, \`desc\`, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, imageId) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
      result = await connection.execute(statement, [name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, imageId]);
    } else {
      const statement = `INSERT INTO goods (name, \`desc\`, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId) VALUES (?,?,?,?,?,?,?,?,?,?);`;
      result = await connection.execute(statement, [name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId]);
    }
    return [result];
  }

  async update(name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, goodId, imageId) {
    if(imageId) {
      const statement1 = `SELECT g.imageId oldimageId  FROM goods g WHERE id = ?;`;
      const [result1] = await connection.execute(statement1, [goodId]);
      const oldimageId = result1[0].oldimageId;
      await connection.execute(`DELETE FROM good_picture WHERE id = ?;`, [oldimageId]);
      const statement = `UPDATE goods SET name=?, \`desc\`=?, newPrice=?, oldPrice=?, status=?, inventoryCount=?, saleCount=?, favorCount=?, address=?, categoryId=?, imageId=? WHERE id=?;`;
      const [result] = await connection.execute(statement, [name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, imageId, goodId]);
      return result;
    } else {
      const statement = `UPDATE goods SET name=?, \`desc\`=?, newPrice=?, oldPrice=?, status=?, inventoryCount=?, saleCount=?, favorCount=?, address=?, categoryId=? WHERE id=?;`;
      const [result] = await connection.execute(statement, [name, desc, newPrice, oldPrice, status, inventoryCount, saleCount, favorCount, address, categoryId, goodId]);
      return result;
    }
  }

  async remove(goodId, imageId) {
    const statement1 = `DELETE FROM good_picture WHERE id =?;`;
    await connection.execute(statement1, [imageId]);
    const statement2 = `DELETE FROM goods WHERE id = ?;`;
    const [result] = await connection.execute(statement2, [goodId]);
    return result;
  }

  async getGoodsList(offset, size) {
    const statement1 = `
    SELECT g.id, g.name, g.desc, g.newPrice, g.oldPrice, g.status, g.inventoryCount, g.saleCount, g.favorCount, g.address, g.createAt, g.updateAt, g.imageId, g.categoryId,
      (SELECT CONCAT('http://localhost:8000/goods/image/', gp.filename) 
        FROM good_picture gp WHERE g.imageId = gp.id) imgUrl 
    FROM goods g LIMIT ?, ?;`;
    const [list] = await connection.execute(statement1, [offset+'', size+'']);
    const statement2 = `SELECT COUNT(*) count FROM goods;`;
    const [totalCount] = await connection.execute(statement2);
    return {
      list,
      totalCount: totalCount[0].count
    };
  }

  async getGoodsListByInfo(name, address, enable, createStart, createEnd, offset, size) {
    try {
      const statement1 = `
      SELECT g.id, g.name, g.desc, g.newPrice, g.oldPrice, g.status, g.inventoryCount, g.saleCount, g.favorCount, g.address, g.createAt, g.updateAt, g.imageId, g.categoryId,
        (SELECT CONCAT('http://localhost:8000/goods/image/', gp.filename) 
          FROM good_picture gp WHERE g.imageId = gp.id) imgUrl 
      FROM goods g 
      WHERE g.name LIKE CONCAT('%', ?, '%') AND g.address LIKE CONCAT('%', ?, '%') AND g.status = ? AND g.createAt >= ? AND g.createAt <= ? LIMIT ?, ?;`;
      const [list] = await connection.execute(statement1, [name, address, enable, createStart, createEnd, offset+'', size+'']);
      const statement2 = `SELECT COUNT(*) count FROM goods g WHERE g.name LIKE CONCAT('%', ?, '%') AND g.address LIKE CONCAT('%', ?, '%') AND g.status = ? AND g.createAt >= ? AND g.createAt <= ?;`;
      const [totalCount] = await connection.execute(statement2, [name, address, enable, createStart, createEnd]);
      return {
        list,
        totalCount: totalCount[0].count
      };
    } catch (error) {
      console.log(error)
    } 
  }

  async getAmountList() {
    const statement = `
    SELECT ga.amount amount, ga.number1 number1, ga.number2 number2, ga.subtitle subtitle, ga.tips tips, ga.title title 
    FROM goods_amount ga;`;
    const [result] = await connection.execute(statement);
    return result;
  }

  async getCountList() {
    const statement = `SELECT gc.id id, gc.name name, gc.goodsCount goodsCount FROM goods_category gc`;
    const [result] = await connection.execute(statement);
    return result;
  }

  async getSaleList() {
    const statement = `SELECT gc.id id, gc.name name, gc.goodsSale goodsSale FROM goods_category gc`;
    const [result] = await connection.execute(statement);
    return result;
  }

  async getFavorList() {
    const statement = `SELECT gc.id id, gc.name name, gc.goodsFavor goodsFavor FROM goods_category gc`;
    const [result] = await connection.execute(statement);
    return result;
  }

  async getAddressList() {
    const statement = `SELECT * FROM goods_address ga`;
    const [result] = await connection.execute(statement);
    return result;
  }
}

module.exports = new GoodsService();