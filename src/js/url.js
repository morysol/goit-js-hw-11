import axios from 'axios';

export default class PicturesApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.API_KEY = '27219391-602be5e609794f999d4badcc3';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.safesearch = true;
    this.orientation = 'horizontal';
    this.image_type = 'photo';

    this.per_page = 40;
  }

  async fetchURL() {
    return await axios.get(this.BASE_URL, {
      params: {
        key: this.API_KEY,
        issafe: this.safesearch,
        orientation: this.orientation,
        image_type: this.image_type,
        q: this.searchQuery,
        per_page: this.per_page,
        page: this.page,
      },
    });
  }

  get query() {
    return this.searchQuery;
  }

  set query(q) {
    this.searchQuery = q;
  }

  get currentPage() {
    return this.page;
  }
  set currentPage(page) {
    this.page = page;
  }
}
