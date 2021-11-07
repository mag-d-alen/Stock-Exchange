/** @format */
class Search {
  constructor(location) {
    this.location = location;

    const inputbox = document.createElement('div');
    inputbox.classList.add('inputbox');

    this.input = document.createElement('input');
    this.input.id = 'query-input';
    this.input.classList.add('input');
    this.input.placeholder = 'Search stock... ';

    const searchBtn = document.createElement('button');
    searchBtn.id = 'search';
    searchBtn.classList.add('btn');
    searchBtn.innerText = 'Search Stocks';

    this.spinner = document.createElement('div');
    this.spinner.classList.add('spinner', 'hidden');

    inputbox.append(this.input);
    this.location.append(inputbox, searchBtn, this.spinner);
  }

  async fetchResults(callback) {
    const query = this.value;
    try {
      const loader = document.getElementById('this.spinner');
      this.spinner.classList.remove('hidden');
      const res = await fetch(
        `${RESULTS_URL}search?query=${query}&limit=${LIMIT}&exchange=NASDAQ`
      );
      const data = await res.json();
      const companies = await this.fetchExtraData(data);
      this.callback(companies);
    } catch (error) {
      console.log(error);
    } finally {
      this.spinner.classList.add('hidden');
    }
  }

  async fetchExtraData(data) {
    const symbols = [];
    const companies = [];
    data.forEach((result) => symbols.push(result.symbol));
    try {
      const res = await Promise.all([
        fetch(`${COMP_URL}${symbols.splice(0, 3)}`),
        fetch(`${COMP_URL}${symbols.splice(0, 3)}`),
        fetch(`${COMP_URL}${symbols.splice(0, 3)}`),
        fetch(`${COMP_URL}${symbols.splice(0, 3)}`),
      ]);
      const data = await Promise.all(res.map((response) => response.json()));

      data.map((item) =>
        item.companyProfiles
          ? item.companyProfiles.forEach((profile) => companies.push(profile))
          : companies.push(item)
      );
      return companies;
    } catch (error) {
      console.log(error);
    }
  }

  searchStart(value) {
    results.innerHTML = '';
    this.value = value;
    this.fetchResults(value);
    this.spinner.classList.remove('hidden');
  }
  onSearch(callback) {
    this.callback = callback;
  }

  init() {
    //checking for query in url
    const querySymbol = new URL(document.location).searchParams.get('query');
    querySymbol &&
      (this.input.value = querySymbol) &&
      this.searchStart(querySymbol);

    let debounceTimeout;
    this.input.addEventListener('keyup', async (event) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        this.searchStart(event.target.value);
      }, 500);
    });
  }
}
