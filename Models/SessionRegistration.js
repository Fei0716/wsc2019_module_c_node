const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SessionRegistration = sequelize.define('Session', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    registration_id: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
}, {
    timestamps: false, // Disable default timestamps
    tableName: 'session_registrations',
});

// Session.belongsTo(Room, { foreignKey: 'room_id' ,as: 'room'}); // Specify the foreign key and alias

module.exports = SessionRegistration;