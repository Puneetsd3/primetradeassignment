const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Note = sequelize.define('Note', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'notes',
    timestamps: true
  });
  return Note;
};
