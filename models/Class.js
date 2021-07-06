module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    name: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'classes',
    timestamps: false
  })
  Class.associate = models => {
    Class.hasMany(models.User, {
      foreignKey: {
        name: 'classId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Class.hasMany(models.Homework, {
      foreignKey: {
        name: 'forClassId',
        allowNull: false
      }
    })
  }
  return Class
}