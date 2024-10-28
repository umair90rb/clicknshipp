'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('StockLevels', 'level', 'current_level');

    await queryInterface.changeColumn('StockLevels', 'current_level', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn('StockLevels', 'item_type', {
      type: Sequelize.ENUM('raw_material', 'finished_product'),
      allowNull: true,
    });

    await queryInterface.addColumn('StockLevels', 'location_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('StockLevels', 'current_level', 'level');

    await queryInterface.removeColumn('StockLevels', 'item_type');
    await queryInterface.removeColumn('StockLevels', 'location_id');

    // Drop the ENUM type created for item_type if necessary
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_StockLevels_item_type";'
    );
  },
};
