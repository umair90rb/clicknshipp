'use strict';
const mappedCities = require('../../data/output-digi');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('CityNameMapings', mappedCities);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('CityNameMapings', null, {});
  },
};
