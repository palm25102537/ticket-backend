module.exports = (sequelize, DataTypes) => {
  const Homework = sequelize.define('Homework', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM(),
      values: ['pending', 'accepted', 'done', 'rejected', 'resolved'],
      allowNull: false
    }
  }, {
    tableName: 'homeworks',
  })
  Homework.associate = models => {
    Homework.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Homework.belongsTo(models.Subject, {
      foreignKey: {
        name: 'subjectId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Homework.belongsTo(models.Class, {
      foreignKey: {
        name: 'forClassId',
        allowNull: false
      }
    })

  }
  return Homework
}