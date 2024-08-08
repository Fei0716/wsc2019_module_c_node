const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Organizer = require('./Organizer');
const Channel = require('./Channel');
const Ticket = require('./Ticket');

const Event = sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    date: DataTypes.DATE,
    organizer_id: DataTypes.INTEGER // Define the foreign key column
}, {
    timestamps: false, // Disable default timestamps
    tableName: 'events',
});
Event.belongsTo(Organizer, { foreignKey: 'organizer_id' ,as: 'organizer'}); // Specify the foreign key and alias

Event.hasMany(Channel ,{foreignKey : 'event_id'});
Channel.belongsTo(Event , {foreignKey : 'event_id', as: 'event'});

Event.hasMany(Ticket , {foreignKey: 'event_id'});
Ticket.belongsTo(Event , {foreignKey: 'event_id'});

module.exports = Event;