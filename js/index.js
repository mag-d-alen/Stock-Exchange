/** @format */

const fetchResults = async () => {
  try {
    const query = await document.getElementById('query-input').value;
    const loader = document.getElementById('spinner');
    spinner.classList.remove('hidden');
    const res = await fetch(
      `${RESULTS_URL}search?query=${query}&limit=${LIMIT}&exchange=NASDAQ`
    );
    const data = await res.json();
    displayResults(data);
  } catch (error) {
    console.log(error);
  } finally {
    spinner.classList.add('hidden');
  }
};
const displayResults = (data) => {
  const results = document.getElementById('results');
  data.map((company) => {
    const result = document.createElement('div');
    const resultLink = document.createElement('a');
    resultLink.setAttribute('href', `./company.html?symbol=${company.symbol}`);
    const symbolDiv = document.createElement('div');
    const nameDiv = document.createElement('div');
    nameDiv.textContent = company.name;
    symbolDiv.textContent = company.symbol;
    resultLink.prepend(symbolDiv, nameDiv);
    result.append(resultLink);
    symbolDiv.classList.add('symbol-div');
    result.classList.add('result');
    resultLink.classList.add('result-link');
    results.appendChild(result);
  });
};

(() => {
  document.getElementById('search').addEventListener('click', fetchResults);
})();
