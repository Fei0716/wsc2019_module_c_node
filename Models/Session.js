const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Room = require('./Room');

const Session = sequelize.define('Session', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    room_id: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    speaker: DataTypes.STRING, // Define the foreign key column
    start: DataTypes.DATE,
    end : DataTypes.DATE,
    type: DataTypes.ENUM('talk' , 'workshop'),
    cost: DataTypes.DECIMAL(9,2),
}, {
    timestamps: false, // Disable default timestamps
    tableName: 'sessions',
});

// Session.belongsTo(Room, { foreignKey: 'room_id' ,as: 'room'}); // Specify the foreign key and alias

module.exports = Session;