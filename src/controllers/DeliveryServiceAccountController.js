import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import TCSCourier from '../services/couriers/tcsCourier';

const { DeliveryServiceAccounts, Tokens } = model;

export default {
  async accounts(req, res) {
    try {
      const accounts = await DeliveryServiceAccounts.findAll({
        where: { active: true },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        order: [['createdAt', 'ASC']],
      });
      return sendSuccessResponse(
        res,
        200,
        { accounts },
        'All service accounts!'
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },
  async account(req, res) {},

  async create(req, res) {
    const {
      name,
      service,
      client_id,
      cost_center,
      key,
      username,
      password,
      dispatch_address,
      return_address,
    } = req.body;
    try {
      let account = null;
      if (key) {
        account = await DeliveryServiceAccounts.findOne({
          where: { key },
        });
      }
      if (account) {
        return sendErrorResponse(
          res,
          422,
          'Service key already exists, add different key!'
        );
      }
      let createData = {
        name,
        service,
        key,
        client_id,
        cost_center,
        username,
        password,
        dispatch_address,
        return_address,
        active: true,
      };
      if (service === 'tcs') {
        const tcsService = new TCSCourier('tcs');
        const headerToken = await tcsService.getHeaderToken(client_id, key);
        const bodyToken = await tcsService.getBodyToken(
          headerToken.token,
          username,
          password
        );
        createData = {
          ...createData,
          tokens: [
            {
              type: 'header',
              ...headerToken,
            },
            { type: 'body', ...bodyToken },
          ],
        };
      }
      account = await DeliveryServiceAccounts.create(createData, {
        include: {
          as: 'tokens',
          model: Tokens,
        },
      });
      return sendSuccessResponse(
        res,
        201,
        {
          account: account?.get(),
        },
        'Service created successfully'
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const {
        name,
        service,
        key,
        client_id,
        cost_center,
        active,
        username,
        password,
        dispatch_address,
        return_address,
      } = req.body;
      const account = await DeliveryServiceAccounts.findByPk(id);
      if (account) {
        account.set({
          name: name,
          service: service,
          key: key,
          client_id: client_id,
          cost_center: cost_center,
          username: username,
          password: password,
          dispatch_address,
          return_address,
          active: active,
          updatedAt: new Date().toISOString(),
        });
        await account.save();
        return sendSuccessResponse(
          res,
          200,
          {
            account: account.get() || null,
          },
          'Operation successful'
        );
      }
      return sendErrorResponse(res, 404, 'No data found with this id');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later',
        e
      );
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      const account = await DeliveryServiceAccounts.findByPk(id);
      if (account) {
        await account.destroy();
        return sendSuccessResponse(res, 200, {}, 'Operation successful');
      }
      return sendErrorResponse(res, 404, 'No data found with this id');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later',
        e
      );
    }
  },
};
