'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex(
      'StockLevels',
      ['item_id', 'location_id', 'item_type'],
      {
        unique: true,
        name: 'unique_item_location_type',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex(
      'StockLevels',
      'unique_item_location_type'
    );
  },
};
