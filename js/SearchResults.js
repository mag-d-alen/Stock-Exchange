/** @format */

class SearchResults {
  constructor(location, companies) {
    this.location = location;
    this.companies = companies;
  }
  highlight(string) {
    const input = document.getElementById('query-input');
    const querySymbol = input.value;
    const reg = new RegExp(querySymbol, 'ig');
    const newText = '<mark>$&</mark>';
    return string.replace(reg, newText);
  }
  displayCompany() {
    const input = document.getElementById('query-input');
    this.companies.map((company) => {
      const results = document.getElementById('results');
      const result = document.createElement('div');
      const resultLink = document.createElement('a');
      const profileImg = document.createElement('img');
      const symbolDiv = document.createElement('div');
      const nameDiv = document.createElement('div');

      resultLink.setAttribute('href', `${SYMBOL_SUFFIX}${company.symbol}`);
      resultLink.target = '_blank';
      nameDiv.innerHTML = this.highlight(company.profile.companyName);
      symbolDiv.innerHTML = this.highlight(company.symbol);
      symbolDiv.classList.add('symbol-div');
      result.classList.add('result');
      resultLink.classList.add('result-link');

      profileImg.classList.add('profile-img');
      if (company.profile) {
        let { changesPercentage, image } = company.profile;
        image != undefined
          ? (profileImg.src = image)
          : (profileImg.src = '../images/noDataIcon.jpg');
        profileImg.setAttribute(
          'onerror',
          `this.src='../images/noDataIcon.jpg'`
        );
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
    });
  }
}
