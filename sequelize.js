const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('ws2019_php_js', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3301',
});

module.exports = sequelize;
