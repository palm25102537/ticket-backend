module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  },
    {
      tableName: 'subjects',
      timestamps: false
    })
  Subject.associate = models => {
    Subject.hasMany(models.Homework, {
      foreignKey: {
        name: 'subjectId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    })
  }
  return Subject
}