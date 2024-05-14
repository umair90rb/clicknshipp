import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";

class CallCourier extends CourierInterface {
  constructor() {
    super();

    this.http = getAxiosInstance(
      "http://cod.callcourier.com.pk/API/CallCourier/",
      {}
    );
  }

  async bookParcel(order, courier) {
    let response, body;
    try {
      const destinationCity = await CityNameMaping.findOne({
        where: {
          [Op.or]: [
            {
              city: order.address.city,
            },
            { maped: order.address.city },
          ],
          courier,
        },
        raw: true,
      });
      if (!destinationCity) {
        return {
          cn: null,
          slip: null,
          isSuccess: false,
          error: "City not found in the database, contact admin",
          response: "destination not found in the db",
        };
      }
      body = `SaveBooking?loginId=${
        order.brand.DeliveryServiceAccount.key
      }&ConsigneeName="${order.customer.first_name}${
        order.customer.last_name || ""
      }"&ConsigneeRefNo="${order.brand.name}x${
        order.brand.shipment_series
      }"&ConsigneeCellNo=${order.customer.phone}&Address=${
        order.address.address1
      }&Origin=FAISALABAD&DestCityId=${
        destinationCity.assigned_id
      }&ServiceTypeId=7&Pcs=${
        order.items.length
      }&Weight=${0.5}&Description=${order.items.reduce(
        (p, c, i) => (i > 0 ? `${c.name}/${p}` : c.name),
        ""
      )}&SelOrigin=Domestic&CodAmount=${
        order.total_price
      }&SpecialHandling=false&MyBoxId=1&Holiday=false&remarks=Rush%20Delivery&ShipperName=SWAP&ShipperCellNo=03005444103&ShipperArea=1&ShipperCity=1&ShipperAddress=286-K,%20GULISTAN%20COLONY%20NO.1,NEAR%20GIRLS%20HIGH%20SCHOOL,%20FAISALABAD"
      &ShipperLandLineNo=03005444103&ShipperEmail=SWAPNEARN@GMAIL.COM`;
      const response = await this.http.post(
        this.getUrlWithApiCred("api/booking/quickBook"),
        body
      );
      logger.log("info", "leopard book parcel api response", {
        res: response.data,
        body,
      });
      return {
        cn: track_number,
        slip: slip_link,
        isSuccess: Boolean(status),
        error: error ? error : null,
        response: status
          ? "Package booked with leopards"
          : "Error: Something goes wrong!",
      };
      return {
        cn: TrackNo,
        slip: "",
        isSuccess: Success,
        error: Error ? Response : null,
        response: Response,
      };
    } catch (error) {}
  }

  checkParcelStatus(trackingNumber) {
    return { current: "At lahore terminal", history: [] };
  }

  downloadReceipt(trackingNumber) {
    // Implementation for downloading receipt via TCS
  }

  cancelBooking(trackingNumber) {
    // Implementation for canceling booking via TCS
  }
}

export default CallCourier;
