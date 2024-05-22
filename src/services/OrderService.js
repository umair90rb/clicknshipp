import model from "../models";

const {
  Order,
  OrderItem,
  Customer,
  Address,
  User,
  Chanel,
  Payments,
  Brand,
  DeliveryServiceAccounts,
  Delivery,
} = model;

class OrderService {
  constructor() {}

  async createSubmissionOrder(_order) {
    try {
      const {
        order: orderData,
        items: itemsData,
        address: addressData,
        customer: customerData,
      } = _order;
      console.log(customerData);
      const order = await Order.create(orderData);
      const address = await order.createAddress(addressData);
      let [customer, created] = await Customer.findOrCreate({
        where: { phone: customerData.phone },
        defaults: {
          phone: customerData.phone,
          first_name: customerData.name,
        },
      });
      if (!created && customer?.first_name === null) {
        await customer.update({ first_name: customerData.name });
      }
      await order.setCustomer(customer.id);
      await address.setCustomer(customer.id);
      const itemsArray = await OrderItem.bulkCreate(itemsData);
      await order.addItems(itemsArray);
      await order.reload();
      return order;
    } catch (error) {
      console.log(error, "error in create submission order in order service");
      return error.message;
    }
  }
}

const orderService = new OrderService();
export default orderService;
