const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    application_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    application_contract: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fee: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    payment_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Suku Bunga jika telat bayar"
    },
    payment_fee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: "fix payment"
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "due date"
    },
    total_payment: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: "fix payment + payment rate"
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "filled after verified"
    },
    account_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "filled after verified"
    },
    account_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "filled after verified"
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('paid','unpaid','pending'),
      allowNull: false,
      defaultValue: "unpaid"
    },
    approved_by: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "{ admin_name, admin_id, paid_on}"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'payments',
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