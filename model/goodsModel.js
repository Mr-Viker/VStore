/**
 * 商品模型
 * @author Viker
 */
// var DAO = require('./dao');
var Sequelize = require('sequelize');
var sequelize = require('./sequelizeConfig');


var Goods = sequelize.define('v_goods', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    cate_id: Sequelize.INTEGER,
    title: Sequelize.STRING,
    desc: Sequelize.TEXT,
    thumb: Sequelize.STRING,
    price: Sequelize.DECIMAL(10, 2),
    amount: Sequelize.INTEGER,
    status: Sequelize.INTEGER,
    favorable_rate: Sequelize.STRING,
    freight: Sequelize.DECIMAL(10, 2),
    paid_num: Sequelize.INTEGER,
    address: Sequelize.STRING,
    hot: Sequelize.INTEGER,
})


module.exports = Goods;


// var Goods = {};

// Goods.findAll = function(limit, columns, cb) {
//     if (typeof columns == 'function') {
//         cb = columns;
//         columns = ["*"];
//     }
//     DAO.findAll('v_goods', {columns: columns, limit: limit}, cb);
// }


// Goods.findById = function(id, columns, cb) {
//     if (typeof columns == 'function') {
//         cb = columns;
//         columns = ["*"];
//     }
//     DAO.find('v_goods', {columns: columns, where: {id: id}}, cb);
// }


// // 查找商品图片数组
// Goods.findImgsById = function(goodsId, columns, cb) {
//     if (typeof columns == 'function') {
//         cb = columns;
//         columns = ["*"];
//     }
//     DAO.find('v_goods_imgs', {columns: columns, where: {goods_id: goodsId}}, cb);
// }