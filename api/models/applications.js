const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applications', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    contract_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "if approved it filled"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    loan: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    installment: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: "per month"
    },
    status: {
      type: DataTypes.ENUM('approved','rejected','waiting','done'),
      allowNull: false,
      defaultValue: "waiting"
    },
    approved_by: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "{ admin_name, admin_id, approved_on}"
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0"
    }
  }, {
    sequelize,
    tableName: 'applications',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
