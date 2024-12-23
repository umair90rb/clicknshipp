import model from '../models';

const { Chanel } = model;

class ChanelService {
  getChanelTokenAndUrl(id) {
    return Chanel.findByPk(id, {
      attributes: ['source'],
    });
  }
}

const _chanelService = new ChanelService();
export default _chanelService;
