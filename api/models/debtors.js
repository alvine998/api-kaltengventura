const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('debtors', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    field_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    place_status: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    other_loan: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    other_loan_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mother_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ktp: {
      type: DataTypes.JSON,
      allowNull: false
    },
    kk: {
      type: DataTypes.JSON,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('approved','rejected','waiting'),
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
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'debtors',
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
