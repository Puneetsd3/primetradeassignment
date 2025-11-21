const sequelize = require('../config/db');

const initUser = require('./user');
const initNote = require('./note');

const User = initUser(sequelize);
const Note = initNote(sequelize);

User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Note };
