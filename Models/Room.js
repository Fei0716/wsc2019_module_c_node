const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Channel = require('./Channel');
const Session = require('./Session');

const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    channel_id: DataTypes.INTEGER, // Define the foreign key column
    name: DataTypes.STRING, // Define the foreign key column
    capacity: DataTypes.INTEGER, // Define the foreign key column
}, {
    timestamps: false, // Disable default timestamps,
    tableName: 'rooms'
});
Room.hasMany(Session , {foreignKey: 'room_id'});
Session.belongsTo(Room , {foreignKey: 'room_id'});

module.exports = Room;