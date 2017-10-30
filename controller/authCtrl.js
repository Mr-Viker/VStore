/**
 * 用户注册登录等授权信息控制器
 * @author: Viker
 */

var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/checkLogin');
var formParser = require('../middlewares/formParser');
var User = require('../model/userModel');


module.exports = router;


// 检测用户是否登录
router.get('/api/checkLogin', checkLogin(), function(req, res) {
    res.send({status: 1, data: req.session.user, msg: '用户已登录'});
})


// 注册
router.post('/api/register', formParser(), function(req, res) {
    var user = req.body;
    if (!user.nickname || !user.phone || !user.password || !user.passwordAgain || !user.captcha) {
        res.send({status: 0, msg: '请填写必填字段'});
        return;
    }
    if (user.password !== user.passwordAgain) {
        res.send({status: 0, msg: '两次输入的密码不一致'});
        return;
    }
    if (user.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        res.send({status: 0, msg: '验证码不正确'});
        return;
    }
    User.findOne({where: {phone: user.phone}})
        .then(function(result) {
            if (result) {
                res.send({status: 2, msg: '该手机号已注册'});
                return;
            }
            delete user.passwordAgain;
            delete user.captcha;
            // 保存用户信息
            User.saveUser(user, function(err, result) {
                if (err) {
                    res.send({status: -2, msg: '保存数据出错'});
                    return;
                }
                res.send({status: 1, data: result, msg: '注册成功'});
            })
        })
        .catch(function(err) {
            res.send({status: -1, msg: '查找数据库出错'});
        });
})


// 用户登录
router.post('/api/login', formParser(), function(req, res) {
    var user = req.body;
    if (!user.phone || !user.password) {
        res.send({status: 0, msg: '请填写必填字段'});
        return;
    }
    // 查找数据库该用户是否存在
    User.findOne({where: {phone: user.phone}})
        .then(function(result) {
            if (!result) {
                res.send({status: 2, msg: '手机号未注册'});
                return;
            }
            // 验证密码是否正确
            User.auth(user, result, function(err, flag) {
                if (err) {
                    res.send({status: -2, msg: '验证出现错误'});
                    return;
                }
                if (!flag) {
                    res.send({status: 3, msg: '密码错误'});
                    return;
                }
                delete result.password;
                req.session.user = result;
                res.send({status: 1, data: req.session.user, msg: '登录成功'});
            })
        })
        .catch(function(err) {
            res.send({status: -1, msg: '查找数据库出错'});
        });
})


// 退出登录
router.get('/api/logout', checkLogin(), function(req, res) {
    delete req.session.user;
    res.send({status: 1, msg: '退出登录成功'});
})