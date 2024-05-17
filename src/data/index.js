const { cities } = require("./cities");
const leopardCities = require("./leopardProductionCityList");
const deawooCities = require("./deawooProductionCityList");
const tcsCities = require("./tcsProductionCityList");
const postexCities = require("./postexCourierProductionCityList");
const traxCities = require("./traxProductionCitiesList");
const callCourierCities = require("./callCourierProductionCityList.js");
module.exports = {
  cities,
  servicesCities: [
    leopardCities,
    deawooCities,
    tcsCities,
    postexCities,
    traxCities,
    callCourierCities,
  ],
  courierList: [
    {
      service: "leopard",
      idKey: "id",
      originKey: "allow_as_origin",
      destnationKey: "allow_as_destination",
      code: "",
      nameKey: "name",
    },
    {
      service: "deawoo",
      idKey: "terminal_id",
      originKey: "",
      destnationKey: "",
      code: "",
      nameKey: "terminal_name",
    },
    {
      service: "tcs",
      idKey: "",
      originKey: "",
      destnationKey: "",
      code: "citycode",
      nameKey: "cityname",
    },
    {
      service: "postex",
      idKey: "",
      originKey: "isPickupCity",
      destnationKey: "isDeliveryCity",
      code: "",
      nameKey: "operationalCityName",
    },
    {
      service: "trax",
      idKey: "id",
      originKey: "pickup",
      destnationKey: "",
      code: "",
      nameKey: "name",
    },
    {
      service: "callcourier",
      idKey: "CityID",
      originKey: "",
      destnationKey: "",
      code: "",
      nameKey: "CityName",
    },
  ],
};
