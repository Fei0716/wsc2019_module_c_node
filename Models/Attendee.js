const sequelize = require('../sequelize');
const {DataTypes, DATE} = require('sequelize');

const Attendee = sequelize.define('Attendee',{
    id: {type: DataTypes.INTEGER , primaryKey: true},
    firstname : DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    registration_code: DataTypes.STRING,
    login_token: DataTypes.STRING,
},{
    timestamps: false,
    tableName: 'attendees',
});
module.exports = Attendee;