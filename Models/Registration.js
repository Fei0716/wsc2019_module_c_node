const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Ticket = require('./Ticket');
const Event = require('./Event'); // Make sure this import is correct and refers to the Event model

const Registration = sequelize.define('Registration', {
    'id': {type:DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
    'attendee_id': DataTypes.INTEGER,
    'ticket_id': DataTypes.INTEGER,
    'registration_time': DataTypes.DATE,
}, {
    timestamps: false, // Disable default timestamps
    tableName: 'registrations',
});
module.exports = Registration;