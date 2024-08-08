const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Event = require('./Event'); // Make sure this import is correct and refers to the Event model

const Organizer = sequelize.define('Organizer', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
}, {
    timestamps: false // Disable default timestamps
});

module.exports = Organizer;