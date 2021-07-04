module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM(),
      values: ['Teacher', 'Student'],
      allowNUll: false
    },
    status: {
      type: DataTypes.ENUM(),
      values: ['Admin', 'User', 'SuperAdmin'],
      allowNull: false
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    accountStatus: {
      type: DataTypes.ENUM(),
      values: ['Active', 'Inactive']
    }
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