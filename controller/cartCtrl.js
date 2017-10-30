var router = require('express').Router();

var Cart = require('../model/cartModel');
var Goods = require('../model/goodsModel');
var checkLogin = require('../middlewares/checkLogin');
var formParser = require('../middlewares/formParser');

module.exports = router;


// 获取购物车信息
router.get('/api/cartInfo', checkLogin(), function(req, res) {
    var userId = req.session.user.id;

    Cart.findAll({where: {user_id: userId}, include: [{model: Goods, as: 'goods'}]})
        .then(function(result) {
            res.send({status: 1, data: result, msg: '获取购物车内容成功'});
        })
        .catch(function(err) {
            console.log('err: ', err);
            res.send({status: -1, msg: '获取购物车内容失败'});
        });
})


// 加入购物车
router.post('/api/cart/add', checkLogin(), formParser(), function(req, res) {
    if (!req.body.goods_id || !req.body.goods_num) {
        res.send({status: 2, msg: '字段不完整'});
        return;
    }

    var cartInfo = {};
    cartInfo.user_id = req.session.user.id;
    cartInfo.goods_id = parseInt(req.body.goods_id) || 0;
    cartInfo.goods_num = parseInt(req.body.goods_num) || 0;

    // 查看商品库存是否充足
    Goods.findOne({where: {id: cartInfo.goods_id}, attributes: ['amount']})
        .then(function(result) {
            if (result < cartInfo.goods_num) {
                res.send({status: 3, msg: '库存不足'});
                return;
            }

            // 查找是否已将该商品加入过购物车
            Cart.findOne({where: {user_id: cartInfo.user_id, goods_id: cartInfo.goods_id}})
                .then(function(result) {
                    if (result) {
                        // 如果加入过购物车 则更新购买数量
                        var goodsNum = result.goods_num + cartInfo.goods_num;
                        Cart.update({goods_num: goodsNum}, {
                            where: {user_id: cartInfo.user_id, goods_id: cartInfo.goods_id}
                        }).then(function(result) {
                            getCartSum(req, res);
                        }).catch(function(err) {
                            res.send({status: -2, msg: '加入购物车失败'});
                        });
                    } else {
                        // 未加入过购物车则创建一条记录
                        Cart.create(cartInfo)
                            .then(function(result) {
                                // 获取购物车总数
                                getCartSum(req, res);
                            })
                            .catch(function(err) {
                                res.send({status: -2, msg: '加入购物车失败'});
                            });
                    }
                })
                .catch(function(err) {
                    console.log('Cart findOne: ', err);
                    res.send({status: -1, msg: '查找数据库失败'});
                });

        })
        .catch(function(err) {
            res.send({status: -1, msg: '查找数据库失败'});
        });
})


// 获取购物车总数
router.get('/api/cart/sum', checkLogin(), getCartSum)


// 更新购物车
router.post('/api/cart/update', checkLogin(), formParser(), function(req, res) {
    var postData = req.body;
    var updateInfo = Object.assign({}, postData);
    var userId = req.session.user.id;
    var where = {};

    if (!postData.id) {
        where.user_id = userId;
    } else {
        where.id = postData.id;
        delete updateInfo.id;
    }

    Cart.update(updateInfo, {where})
        .then(function(result) {
            // 查找购物车总价
            Cart.findAll({where: {user_id: userId, is_checked: 1}, include: [{model: Goods, as: 'goods'}]})
                .then(function(result) {
                    result = JSON.parse(JSON.stringify(result));
                    var totalPrice = 0;
                    result.forEach(function(item) {
                        console.log('item.goods_num: ', item.goods_num);
                        console.log('item.goods.price: ', item.goods.price);
                        console.log('totalPrice: ', totalPrice);
                        totalPrice += item.goods_num * item.goods.price;
                    })
                    res.send({status: 1, data: totalPrice.toFixed(2), msg: '更新购物车成功'});
                })
                .catch(function(err) {
                    console.log('total err: ', err);
                    res.send({status: -1, msg: '更新购物车失败'});
                });
        })
        .catch(function(err) {
            console.log('update err: ', err);
            res.send({status: -1, msg: '更新购物车失败'});
        });
})



// 获取购物车总数fn
function getCartSum(req, res) {
    var userId = req.session.user.id;

    Cart.sum('goods_num', {where: {user_id: userId}})
        .then(function(sum) {
            res.send({status: 1, data: sum, msg: '获取购物车总数成功'});
        })
        .catch(function(err) {
            res.send({status: -2, msg: '获取购物车总数失败'});
        })
}