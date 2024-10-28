'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('StockHistories', 'type', 'item_type');
    await queryInterface.changeColumn('StockHistories', 'item_type', {
      type: Sequelize.ENUM('raw_material', 'finished_product'),
      allowNull: false,
    });

    await queryInterface.renameColumn('StockHistories', 'amount', 'quantity');
    await queryInterface.changeColumn('StockHistories', 'quantity', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn('StockHistories', 'movement_type', {
      type: Sequelize.ENUM('in', 'out'),
      allowNull: false,
    });

    await queryInterface.addColumn('StockHistories', 'location_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn('StockHistories', 'gate_pass_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.removeColumn('StockHistories', 'expiry');
    await queryInterface.removeColumn('StockHistories', 'stock_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('StockHistories', 'item_type', 'type');
    await queryInterface.changeColumn('StockHistories', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.renameColumn('StockHistories', 'quantity', 'amount');
    await queryInterface.changeColumn('StockHistories', 'amount', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.removeColumn('StockHistories', 'item_id');
    await queryInterface.removeColumn('StockHistories', 'movement_type');
    await queryInterface.removeColumn('StockHistories', 'location_id');
    await queryInterface.removeColumn('StockHistories', 'gate_pass_id');
    await queryInterface.addColumn('StockHistories', 'expiry', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('StockHistories', 'stock_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_StockHistories_item_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_StockHistories_movement_type";'
    );
  },
};
