var mysql = require('mysql');
var CONFIG = require('../config');

var db;
var DAO = {};


module.exports = DAO;


DAO.create = function() {
    db = mysql.createConnection(CONFIG);
    db.connect();
    db.on('error', this._handleError);
}


// 保存数据
DAO.save = function(table, data, cb) {
    data.create_time = Math.round(Date.now() / 1000);
    var sql = "insert into " + table + " (" + Object.keys(data).join(",") + ") values (" + Object.keys(data).map((i) => "'" + data[i] + "'").join(",") + ")";
    db.query(sql, cb);
}


// 更新数据
// update: 要更新的数据
// where: 条件
DAO.update = function(table, data, cb) {
    var update = data.update;
    var where = data.where;
    if (!where) {
        cb('请检查查询语句');
        return;
    }
    var sql = "update " + table + " set ";
    for(var i in update) {
        if (update.hasOwnProperty(i)) {
            sql += i + " = '" + update[i].replace(/\\/, '\\\\') + "',";
        }
    }
    sql = sql.slice(0, sql.length - 1) + " where ";
    for(var i in where) {
        if (where.hasOwnProperty(i)) {
            sql += i + " = '" + where[i] + "',";
        }
    }
    sql = sql.slice(0, sql.length - 1);
    db.query(sql, cb);
}


// 删除数据
DAO.del = function(table, data, cb) {
    var sql = "delete from " + table + " where ";
    for(var i in data) {
        if (data.hasOwnProperty(i)) {
            sql += i + " = '" + data[i] + "',";
        }
    }
    sql = sql.slice(0, sql.length - 1);
    db.query(sql, cb);
}


// 获取表格全部数据
DAO.findAll = function(table, data, cb) {
    var limit = data.limit;
    var sql;
    if (!limit) {
        sql = "select " + data.columns.join(',') + " from " + table;
    } else {
        sql = "select " + data.columns.join(',') + " from " + table + " limit " + (limit.page * limit.pageNum) + ", " + limit.pageNum;
    }
    db.query(sql, cb);
}


// 获取单条数据
// where: 查询条件
// columns: 所需返回的列 array
DAO.find = function(table, data, cb) {
    var where = data.where;
    if (!where) {
        this.findAll(table, data, cb);
        return;
    }
    var sql = "select " + data.columns.join(',') + " from " + table + " where ";
    for(var i in where) {
        if (where.hasOwnProperty(i)) {
            sql += i + " = '" + where[i] + "',";
        }
    }
    sql = sql.slice(0, sql.length - 1);
    db.query(sql, function(err, result) {
        if (err) {
            cb(err);
            return;
        }
        cb(null, result[0]);
    });
}


// 处理错误(发生错误断开后重新连接数据库)
DAO._handleError = function(err) {
    if (!err.fatal) {
        return;
    }
    if (err.code != 'PROTOCOL_CONNECTION_LOST') {
        throw err;
    }
    this.create();
}


DAO.create();