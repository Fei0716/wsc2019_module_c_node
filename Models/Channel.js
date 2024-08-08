const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Event = require('./Event');
const Room = require('./Room');

const Channel = sequelize.define('Channel', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    event_id: DataTypes.INTEGER, // Define the foreign key column
    name: DataTypes.STRING,
}, {
    timestamps: false, // Disable default timestamps
    tableName: 'channels',
});
Channel.hasMany(Room , {foreignKey: 'channel_id'});
Room.belongsTo(Channel, {foreignKey: 'channel_id'});

module.exports = Channel;