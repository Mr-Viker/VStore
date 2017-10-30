/**
 * 商品控制器
 * @author Viker
 */
var router = require('express').Router();

var Goods = require('../model/goodsModel');
var GoodsImgs = require('../model/goodsImgsModel');
var GoodsCate = require('../model/goodsCateModel');

module.exports = router;


// 获取商品列表
router.get('/api/goodsList', function(req, res) {
    var offset = parseInt(req.query.page) || 0;
    var limit = parseInt(req.query.pageNum) || 10;
    var cateId = req.query.type;
    var hot = req.query.hot;

    var opt = {
        offset: offset * limit, 
        limit: limit,
        where: {
            status: 1,
        },
    };
    if (cateId && cateId != '0') {
        opt.where.cate_id = cateId;
    }
    if (hot != null && typeof hot != 'undefined') {
        opt.where.hot = parseInt(hot);
    }

    Goods.findAll(opt)
        .then(function(result) {
            res.send({status: 1, data: result, msg: '获取商品列表成功'});
        })
        .catch(function(err) {
            console.log('err: ', err);
            res.send({status: -1, msg: '查找数据库失败'});
        });
})


// 获取商品详情
router.get('/api/goodsDetailInfo', function(req, res) {
    var goodsId = req.query.goodsId;
    if (!goodsId) {
        res.send({status: 0, msg: '缺少商品ID'});
        return;
    }
    if (!parseInt(goodsId)) {
        res.send({status: 3, msg: '非法商品ID'});
        return;
    }
    Goods.findById(goodsId)
        .then(function(result) {
            if (!result) {
                res.send({status: 2, msg: '未找到该商品'});
                return;
            }
            GoodsImgs.findAll({where: {goods_id: goodsId}, attributes: ['img']})
                .then(function(imgs) {
                    var retData = result.dataValues;
                    retData.imgs = imgs.map(function(item) {
                        return item.img;
                    });
                    res.send({status: 1, data: retData, msg: '获取商品详情成功'});
                })
                .catch(function(err) {
                    console.log('err', err);
                    res.send({status: -1, msg: '查找数据库失败'});
                });
        })
        .catch(function(err) {
            res.send({status: -1, msg: '查找数据库失败'});
        });
})


// 获取商品类型列表
router.get('/api/goodsCateList', function(req, res) {
    GoodsCate.findAll()
        .then(function(result) {
            result.sort(function(a, b){
                return a.id - b.id;
            })
            res.send({status: 1, data: result, msg: '获取商品类型列表成功'});
        })
        .catch(function(err) {
            res.send({status: -1, msg: '获取商品类型列表失败'});
        })
})


// 搜索商品
router.get('/api/goods/search', function(req, res) {
    Goods.findAll({
        where: {title: {$like: '%' + (req.query.search || '') + '%'}},
        offset: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.pageNum) || 10,
    }).then(function(result) {
            res.send({status: 1, data: result, msg: '获取搜索结果成功'});
        })
        .catch(function(err) {
            res.send({status: -1, msg: '获取搜索结果失败'});
        });
})