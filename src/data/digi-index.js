const { cities } = require('./cities.js');
const digi = require('./digiCourierProductionCities');

module.exports = {
  cities,
  servicesCities: [digi],
  courierList: [
    {
      service: 'digi',
      idKey: 'id',
      originKey: '',
      destnationKey: '',
      code: '',
      nameKey: 'city_name',
    },
  ],
};
