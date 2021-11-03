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
    fetchExtraData(data);
  } catch (error) {
    console.log(error);
  } finally {
    spinner.classList.add('hidden');
  }
};

const fetchExtraData = async (data) => {
  const symbols = [];
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
            ? item.companyProfiles.forEach((profile) => displayCompany(profile))
            : displayCompany(item)
        )
      );
  } catch (error) {
    console.log(error);
  }
};

const displayCompany = (company) => {
  const results = document.getElementById('results');
  const result = document.createElement('div');
  const resultLink = document.createElement('a');
  const profileImg = document.createElement('img');
  const symbolDiv = document.createElement('div');
  const nameDiv = document.createElement('div');

  resultLink.setAttribute('href', `${SYMBOL_SUFFIX}${company.symbol}`);
  resultLink.target = '_blank';
  nameDiv.innerHTML = highlight(company.profile.companyName);
  symbolDiv.innerHTML = highlight(company.symbol);
  symbolDiv.classList.add('symbol-div');
  result.classList.add('result');
  resultLink.classList.add('result-link');

  profileImg.classList.add('profile-img');
  if (company.profile) {
    let { changesPercentage, image } = company.profile;
    image != undefined
      ? (profileImg.src = image)
      : (profileImg.src = '../images/noDataIcon.jpg');
    profileImg.setAttribute('onerror', `this.src='../images/noDataIcon.jpg'`);
    resultLink.prepend(symbolDiv, nameDiv);
    result.append(resultLink);
    result.prepend(profileImg);
    results.appendChild(result);

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
