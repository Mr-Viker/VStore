var Sequelize = require('sequelize');

var CONFIG = require('../config');


var sequelize = new Sequelize(CONFIG.database, CONFIG.username, CONFIG.password, {
    host: CONFIG.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
    define: {
        underscored: true,
        freezeTableName: true,
    }
})

sequelize
    .authenticate()
    .then(function() {
        console.log('connect succeed');
    })
    .catch(function(err) {
        console.log('connect fail: ', err);
    })

module.exports = sequelize;