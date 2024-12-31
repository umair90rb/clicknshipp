import model from '../models';

const { Chanel } = model;

class ChanelService {
  getChanelTokenAndUrl(id) {
    try {
      return Chanel.findByPk(id, {
        attributes: ['source', 'token'],
      });
    } catch (error) {
      console.log(error, 'error in chanel service');
    }
  }
}

const _chanelService = new ChanelService();
export default _chanelService;
