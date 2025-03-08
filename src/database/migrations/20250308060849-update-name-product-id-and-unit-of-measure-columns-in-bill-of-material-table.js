'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('BillOfMaterials', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('BillOfMaterials', 'unit_of_measure', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.renameColumn('BillOfMaterials', 'name', 'comment');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('BillOfMaterials', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn('BillOfMaterials', 'unit_of_measure', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.renameColumn('BillOfMaterials', 'comment', 'name');
  },
};
