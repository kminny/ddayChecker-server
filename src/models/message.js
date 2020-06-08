module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      message: {
        field: 'message',
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'message',
      },
      name: {
        field: 'name',
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'name',
      },
    },
    {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
      tableName: 'Message',
    }
  );

  return Message;
};
