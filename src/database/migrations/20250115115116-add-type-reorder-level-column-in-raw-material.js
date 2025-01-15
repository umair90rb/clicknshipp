'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('RawMaterials', 're_order_level', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('RawMaterials', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'raw_material',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('RawMaterials', 're_order_level');
    await queryInterface.removeColumn('RawMaterials', 'type');
  },
};
