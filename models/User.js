module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    role: {
      type: DataTypes.ENUM(),
      values: ['Teacher', 'Student'],
      allowNUll: false
    },
    class: { type: DataTypes.STRING, allowNull: false },
    contactInfo: { type: DataTypes.STRING, allowNull: false }
  },
    {
      tableName: 'users',
      underscored: true
    })
  User.associate = models => {
    User.hasMany(models.Homework,
      {
        foreignKey: {
          name: 'userId',
          allowNull: false
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      })
  }
  return User
}