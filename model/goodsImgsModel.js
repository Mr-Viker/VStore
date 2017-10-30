/**
 * 商品图片模型
 * @author Viker
 */

var Sequelize = require('sequelize');
var sequelize = require('./sequelizeConfig');


var GoodsImgs = sequelize.define('v_goods_imgs', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    goods_id: Sequelize.INTEGER,
    img: Sequelize.STRING,
})


module.exports = GoodsImgs;
