const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Event = require('./Event');
const Registration = require('./Registration');

const Ticket = sequelize.define('Ticket', {
    'id': {type:DataTypes.INTEGER, primaryKey: true},
    'event_id': DataTypes.INTEGER,
    'name': DataTypes.STRING,
    'cost': DataTypes.DECIMAL,
    'special_validity': DataTypes.STRING,
}, {
    timestamps: false, // Disable default timestamps
    tableName: 'event_tickets',
});
Ticket.hasMany(Registration , {foreignKey: 'ticket_id'});
Registration.belongsTo(Ticket , {foreignKey: 'ticket_id'});
module.exports = Ticket;