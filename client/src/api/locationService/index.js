import Ajax from 'api/ajax';

class LocationService extends Ajax {
  pathname = 'location';

  fetchAllLocation = () => this.getJson(`${this.pathname}/all`);

  fetchLocation = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateLocation = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateLocation = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteLocation = (id) => this.delete(`${this.pathname}/${id}`);
}

export const locationService = new LocationService();
