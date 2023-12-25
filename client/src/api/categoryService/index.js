import Ajax from 'api/ajax';

class CategoryService extends Ajax {
  pathname = 'category';

  fetchAllCategory = () => this.getJson(`${this.pathname}/all`);

  fetchCategory = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateCategory = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateCategory = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteCategory = (id) => this.delete(`${this.pathname}/${id}`);
}

export const categoryService = new CategoryService();
