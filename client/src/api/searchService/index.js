import Ajax from 'api/ajax';

class SearchService extends Ajax {
  pathname = 'search';

  fetchSearch = (data, options) => this.post(`${this.pathname}`, data, {}, options);
}

export const searchService = new SearchService();
