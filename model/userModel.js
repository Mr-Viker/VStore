/**
 * 用户模型
 * @author Viker
 */
var bcrypt = require('bcryptjs');

// var DAO = require('./dao');
var Sequelize = require('sequelize');
var sequelize = require('./sequelizeConfig');


var User = sequelize.define('v_user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    nickname: Sequelize.STRING,
    password: Sequelize.STRING,
    phone: Sequelize.INTEGER,
    avatar: Sequelize.STRING,
})


module.exports = User;



// 新增用户
User.saveUser = function(user, cb) {
    // 加密用户密码
    this._hash(user.password, function(err, hash) {
        if (err) {
            cb(err);
            return;
        }
        user.password = hash;
        // 保存进数据库
        User.create(user)
            .then(function(result) {
               cb(null, result);
            })
            .catch(function(err) {
                cb(err);
            })
    });
}


// 加密数据
User._hash = function(data, cb) {
    bcrypt.hash(data, 12, cb);
}


// 验证用户
User.auth = function(user, data, cb) {
    bcrypt.compare(user.password, data.password, cb);
}



// function User(obj) {
//     for(var i in obj) {
//         if (obj.hasOwnProperty(i)) {
//             this[i] = obj[i];
//         }
//     }
// }


// // 查找用户 - 根据手机号
// // columns：想返回的列 不传则为所有列
// User.findByPhone = function(phone, columns, cb) {
//     if (typeof columns == 'function') {
//         cb = columns;
//         columns = ['*'];
//     }
//     DAO.find('v_user', {columns: columns, where: {phone: phone}}, cb);
// }

// // 查找用户 - 根据ID
// User.findById = function(id, columns, cb) {
//     if (typeof columns == 'function') {
//         cb = columns;
//         columns = ['*'];
//     }
//     DAO.find('v_user', {columns: columns, where: {id: id}}, cb);
// }




// // 更新用户信息
// User.update = function(user, cb) {
//     var id = user.id;
//     var update = Object.assign({}, user);
//     delete update.id;
//     DAO.update('v_user', {update: update, where: {id: id}}, cb);
// }