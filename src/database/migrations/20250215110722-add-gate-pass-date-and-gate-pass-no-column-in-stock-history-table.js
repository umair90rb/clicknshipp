'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('StockHistories', 'gate_pass_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.renameColumn(
      'StockHistories',
      'gate_pass_id',
      'gate_pass_no'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('StockHistories', 'gate_pass_date');
    await queryInterface.renameColumn(
      'StockHistories',
      'gate_pass_no',
      'gate_pass_id'
    );
  },
};
