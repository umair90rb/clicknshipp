"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CityNameMapings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      maped: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courier: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courier: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      assigned_id: {
        type: Sequelize.STRING,
      },
      active_as_origin: {
        type: Sequelize.BOOLEAN,
      },
      active_as_destination: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CityNameMapings");
  },
};
