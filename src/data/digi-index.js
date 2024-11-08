const { cities } = require('./cities.js');
const bluxCities = require('./digiBluexCourierProductionList.js');
const leopardCities = require('./digiLeopardCourierProductionCity.js');
const mnpCities = require('./digiMNPCourierProductionCityList.js');
const swiftCities = require('./digiSwiftCourierProducitonList.js');
const traxCities = require('./digiTraxCourierProductionCity.js');

module.exports = {
  cities,
  servicesCities: [
    leopardCities,
    swiftCities,
    traxCities,
    mnpCities,
    bluxCities,
  ],
  courierList: [
    {
      service: 'digi_leopard',
      idKey: 'city_id',
      originKey: '',
      destnationKey: '',
      code: '',
      nameKey: 'city_name',
    },
    {
      service: 'digi_swift',
      idKey: 'city_id',
      originKey: '',
      destnationKey: '',
      code: '',
      nameKey: 'city_name',
    },
    {
      service: 'digi_trax',
      idKey: 'city_id',
      originKey: '',
      destnationKey: '',
      code: '',
      nameKey: 'city_name',
    },
    {
      service: 'digi_mnp',
      idKey: 'city_id',
      originKey: '',
      destnationKey: '',
      code: '',
      nameKey: 'city_name',
    },
    {
      service: 'digi_bluex',
      idKey: 'city_id',
      originKey: '',
      destnationKey: '',
      code: '',
      nameKey: 'city_name',
    },
  ],
};
