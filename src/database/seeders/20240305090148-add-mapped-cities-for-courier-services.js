"use strict";
const mappedCities = require("../../data/mappedCities");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .bulkDelete("CityNameMapings", null, {})
      .then(() => queryInterface.bulkInsert("CityNameMapings", mappedCities));
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("CityNameMapings", null, {});
  },
};
