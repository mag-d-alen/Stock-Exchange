/** @format */
const querySymbol = new URL(document.location).searchParams.get('query');
const input = document.getElementById('query-input');

const highlight = (string) => {
  const querySymbol = input.value;
  const reg = new RegExp(querySymbol, 'ig');
  const newText = '<mark>$&</mark>';
  return string.replace(reg, newText);
};

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
  data.map((company, i) => {
    const result = document.createElement('div');
    const resultLink = document.createElement('a');
    result.id = i;
    resultLink.setAttribute('href', `${SYMBOL_SUFFIX}${company.symbol}`);
    resultLink.target = '_blank';
    const symbolDiv = document.createElement('div');
    const nameDiv = document.createElement('div');
    nameDiv.innerHTML = highlight(company.name);
    symbolDiv.innerHTML = highlight(company.symbol);
    resultLink.prepend(symbolDiv, nameDiv);
    result.append(resultLink);
    symbolDiv.classList.add('symbol-div');
    result.classList.add('result');
    resultLink.classList.add('result-link');

    results.appendChild(result);
    fetchExtraData(result.id, company.symbol);
  });
};

const fetchExtraData = async (id, symbol) => {
  try {
    const result = document.getElementById(id);
    const profileImg = document.createElement('img');
    profileImg.classList.add('profile-img');
    const res = await fetch(`${COMP_URL}${symbol}`);
    const data = await res.json();

    if (data.profile) {
      let { changesPercentage, image } = data.profile;
      image != undefined
        ? (profileImg.src = image)
        : (profileImg.src = '../images/noDataIcon.jpg');
      profileImg.setAttribute('onerror', `this.src='../images/noDataIcon.jpg'`);

      const percentChange = document.createElement('div');
      percentChange.innerText = changesPercentage;
      percentChange.classList.add('profile-changes');
      if (changesPercentage !== '(0%)') {
        const percentShorten = Number(changesPercentage).toFixed(3);
        percentChange.innertext = `${percentShorten} %`;
        percentShorten > 0
          ? percentChange.classList.add('green')
          : percentChange.classList.add('red');
      } else {
        percentChange.innerHTML = 'No data on recent price changes';
      }
      result.append(percentChange);
    } else {
      profileImg.src = './images/noDataIcon.jpg';
    }
    result.prepend(profileImg);
  } catch (error) {
    console.log(error);
  }
};

const searchStart = () => {
  results.innerHTML = '';
  fetchResults(input.value);
  spinner.classList.remove('hidden');
};

const debounce = (foo, timeout = 700) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      foo.apply(this, args);
    }, timeout);
  };
};
const autoSearch = debounce(() => searchStart());

(() => {
  input.addEventListener('input', autoSearch);
  const search = document.getElementById('search');
  search.addEventListener('click', fetchResults);
  //checking for query in url
  querySymbol && (input.value = querySymbol) && autoSearch();
})();
