/** @format */

class Company {
  constructor(location, symbol) {
    this.location = location;
    this.symbol = symbol;
    this.myChart = document.createElement('canvas');

    this.makeElements();
    this.getCompanyProfile(symbol);
    this.fetchHistoricData(symbol);
  }

  makeElements() {
    const wrapper = this.location;
    const company = document.createElement('div');
    const compPrice = document.createElement('div');
    const compImage = document.createElement('img');
    const name = document.createElement('div');
    const compDescription = document.createElement('div');
    const link = document.createElement('a');
    const changes = document.createElement('div');
    const graph = document.createElement('section');
    const container = document.createElement('div');

    company.id = `company${this.symbol}`;
    compPrice.id = `compPrice${this.symbol}`;
    compImage.id = `compImage${this.symbol}`;
    name.id = `name${this.symbol}`;
    compDescription.id = `compDescription${this.symbol}`;
    link.id = `link${this.symbol}`;
    changes.id = `changes${this.symbol}`;
    this.myChart.id = `myChart${this.symbol}`;

    link.textContent = 'Visit our site';
    link.target = '_blank';

    company.classList.add('company');
    compImage.classList.add('company-img');
    name.classList.add('company-name');
    compDescription.classList.add('company-description');
    link.classList.add('company-link');
    compPrice.classList.add('company-price');
    compDescription.classList.add('company-description');
    container.classList.add('container');
    graph.classList.add('graph');

    graph.append(container);
    container.append(this.myChart);
    this.myChart.getContext('2d');

    company.append(
      compImage,
      name,
      compDescription,
      link,
      compPrice,
      compDescription,
      changes,
      graph
    );

    wrapper.append(company);
  }

  async getCompanyProfile(symbol) {
    const spinner = document.getElementById('spinner');
    try {
      spinner.classList.remove('hidden');
      const res = await fetch(`${COMP_URL}${symbol}`);
      const data = await res.json();
      this.displayCompany(data.profile);
    } catch (error) {
      console.error(error);
    } finally {
      spinner.classList.add('hidden');
    }
  }

  displayCompany(comp) {
    const {
      image,
      companyName,
      description,
      website,
      changesPercentage,
      price,
    } = comp;
    const compImg = document.getElementById(`compImage${this.symbol}`);
    image != undefined
      ? (compImg.src = image)
      : (compImg.src = './images/noDataIcon.jpg');
    compImg.setAttribute('onerror', `this.src='./images/noDataIcon.jpg'`);
    document.getElementById(`name${this.symbol}`).innerText = companyName;
    document.getElementById(`compDescription${this.symbol}`).innerText =
      description;
    document.getElementById(
      `compPrice${this.symbol}`
    ).innerText = `Stock price $${price}`;
    document.getElementById(`link${this.symbol}`).href = website;
    const changes = document.getElementById(`changes${this.symbol}`);
    if (changesPercentage !== '(0%)') {
      const percentShorten = Number(changesPercentage).toFixed(3);
      changes.innerText = `${percentShorten} %`;
      percentShorten > 0
        ? changes.classList.add('changes-green')
        : changes.classList.add('changes-red');
      changes.innerHTML = `Recent price change ${percentShorten} %`;
    } else {
      changes.innerHTML = 'No data on recent price changes';
    }
    changes.classList.add('company-changes');
  }

  async fetchHistoricData(symbol) {
    try {
      const res = await fetch(`${HISTORIC_URL}${symbol}${SERIE}`);
      const data = await res.json();
      spinner.classList.add('hidden');
      const dates = [];
      const prices = [];
      data.historical.slice(0, 100).map((entry) => dates.push(entry.date));
      data.historical.slice(0, 100).map((entry) => prices.push(entry.close));
      const stocksChart = new Chart(this.myChart, {
        type: 'bar',
        data: {
          labels: dates.reverse(),
          datasets: [
            {
              label: `${symbol} Stock prices`,
              data: prices.reverse(),
              borderColor: 'lightgray',
              backgroundColor: 'darkgray',
            },
          ],
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      spinner.classList.add('hidden');
    }
  }
}
