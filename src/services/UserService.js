import models from '../models';
const { User } = models;

class UserService {
  getById(id, scope = 'clean') {
    return User.scope(scope).findByPk(id);
  }
}

const _userService = new UserService();
export default _userService;
