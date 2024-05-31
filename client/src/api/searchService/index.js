import Ajax from 'api/ajax';

class SearchService extends Ajax {
  pathname = 'search';

  fetchSearch = (data) => this.post(`${this.pathname}`, data);
}

export const searchService = new SearchService();
