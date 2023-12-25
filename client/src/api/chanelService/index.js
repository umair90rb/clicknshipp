import Ajax from 'api/ajax';

class ChanelService extends Ajax {
  pathname = 'chanel';

  fetchAllChanel = () => this.getJson(`${this.pathname}/all`);

  fetchChanel = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateChanel = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateChanel = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteChanel = (id) => this.delete(`${this.pathname}/${id}`);
}

export const chanelService = new ChanelService();
