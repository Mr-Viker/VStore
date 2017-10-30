/**
 * 购物车模型
 */

var Sequelize = require('sequelize');
var sequelize = require('./sequelizeConfig');
var Goods = require('./goodsModel');


var Cart = sequelize.define('v_cart', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: Sequelize.INTEGER,
    goods_id: Sequelize.INTEGER,
    goods_num: Sequelize.INTEGER,
    is_checked: Sequelize.INTEGER,
})

Cart.belongsTo(Goods, {as: 'goods', foreignKey: 'goods_id', targetKey: 'id'});

module.exports = Cart;