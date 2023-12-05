import Ajax from 'api/ajax';

class PermissionService extends Ajax {
  pathname = 'permission';

  fetchAllUser = () => this.getJson(`${this.pathname}/all`);
}

export const permissionService = new PermissionService();
