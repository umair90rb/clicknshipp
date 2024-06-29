import Ajax from 'api/ajax';

class DesignationService extends Ajax {
  pathname = 'designation';

  fetchAllDesignation = () => this.getJson(`${this.pathname}/all`);

  fetchDesignation = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateDesignation = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateDesignation = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteDesignation = (id) => this.delete(`${this.pathname}/${id}`);
}

export const designationService = new DesignationService();
