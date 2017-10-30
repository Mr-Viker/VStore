/**
 * 商品类型模型
 */

var Sequelize = require('sequelize');
var sequelize = require('./sequelizeConfig');


var GoodsCate = sequelize.define('v_goods_cate', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    cate_name: Sequelize.STRING,
    status: Sequelize.INTEGER,
})


module.exports = GoodsCate;