'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'StockLevels',
      'StockLevels_item_id_fkey'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('StockLevels', {
      fields: ['item_id'],
      type: 'foreign key',
      name: 'StockLevels_item_id_fkey',
      references: {
        table: 'Items', // or RawMaterials, depending on your initial setup
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
