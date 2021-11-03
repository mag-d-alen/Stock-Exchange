/** @format */
class Search {
  constructor(input) {
    this.input = input;
  }

  async fetchResults() {
    try {
      const query = await this.input.value;
      const loader = document.getElementById('spinner');
      spinner.classList.remove('hidden');
      const res = await fetch(
        `${RESULTS_URL}search?query=${query}&limit=${LIMIT}&exchange=NASDAQ`
      );
      const data = await res.json();
      this.fetchExtraData(data);
    } catch (error) {
      console.log(error);
    } finally {
      spinner.classList.add('hidden');
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
      ])
        .then((resps) => Promise.all(resps.map((res) => res.json())))
        .then((data) =>
          data.map((item) =>
            item.companyProfiles
              ? item.companyProfiles.forEach((profile) =>
                  companies.push(profile)
                )
              : companies.push(item)
          )
        );
      this.displayCompanies(companies);
    } catch (error) {
      console.log(error);
    }
  }

  displayCompanies(companies) {
    const searchResults = new SearchResults(
      document.getElementById('results'),
      companies
    );
    searchResults.displayCompany();
  }

  searchStart(value) {
    results.innerHTML = '';
    this.fetchResults(value);
    spinner.classList.remove('hidden');
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
