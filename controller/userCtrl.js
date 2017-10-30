var router = require('express').Router();

var User = require('../model/userModel');
var formParser = require('../middlewares/formParser');
var checkLogin = require('../middlewares/checkLogin');

module.exports = router;


router.get('/api/user', checkLogin(), function(req, res) {
    var id = req.query.id;
    if (id != req.session.user.id) {
        res.send({status: 3, msg: '无权限查看该页面'});
        return;
    }
    // 如果session有则直接从session里拿
    if (req.session.user) {
        res.send({status: 1, data: req.session.user, msg: '获取用户信息成功'});
        return;
    }
    if (!id) {
        res.send({status: 0, msg: '缺少参数'});
        return;
    }
    // 从数据库里获取
    User.findOne({attributes: ['id', 'nickname', 'phone', 'avatar', 'create_at', 'update_at'], where: {id: id}})
        .then(function(result) {
            if (!result || result.length <= 0) {
                res.send({status: 2, msg: '该用户不存在'});
                return;
            }
            res.send({status: 1, data: result, msg: '获取用户信息成功'});
        })
        .catch(function(err) {
            res.send({status: -1, msg: '查找数据库出错'});
        });
})


// 更新用户信息
router.post('/api/user/update', formParser(), function(req, res) {
    var postData = req.body || {};
    // if (req.files.avatar) {
    //     postData.avatar = req.files.avatar.path;
    // }
    if (!postData.nickname) {
        res.send({status: 0, msg: '请填写必填字段'});
        return;
    }
    User.update(postData, {id: postData.id})
        .then(function(result) {
            User.findOne({attributes: ['id', 'nickname', 'phone', 'avatar', 'create_at', 'update_at'], where: {id: postData.id}})
                .then(function(result) {
                    req.session.user = result;
                    res.send({status: 1, data: result, msg: '更新成功'});
                })
                .catch(function(err) {
                    res.send({status: -2, msg: '获取更新后的数据失败'});
                });
        })
        .catch(function(err) {
           res.send({status: -1, msg: '更新失败'});
        });
})