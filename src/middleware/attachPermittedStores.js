import { metafieldNamespaces, metafieldOwners } from '../constants/metafield';
import _metafieldService from '../services/MetafieldService';
import _userService from '../services/UserService';

export default async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await _userService.getById(userId, 'settings');
    if (
      user &&
      'settings' in user &&
      metafieldNamespaces.storeAccess in user.settings &&
      user.settings[metafieldNamespaces.storeAccess] == true
    ) {
      const storeAccess = await _metafieldService.getAll(
        userId,
        metafieldOwners.user,
        metafieldNamespaces.storeAccess
      );
      if (storeAccess.length > 0) {
        req.user.stores = storeAccess.map((store) => store.value);
      }
    } else {
      req.user.stores = [];
    }
    next();
  } catch (e) {
    console.error('Error attaching permitted stores:', e);
    next();
  }
};
