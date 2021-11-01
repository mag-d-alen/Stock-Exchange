/** @format */

const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get('symbol');

const makeElements = () => {
  const wrapper = document.getElementById('company-content-wrapper');
  const company = document.createElement('div');
  const compPrice = document.createElement('div');
  const compImage = document.createElement('img');
  const name = document.createElement('div');
  const compDescription = document.createElement('div');
  const link = document.createElement('a');
  const changes = document.createElement('div');
  const graph = document.createElement('section');
  const container = document.createElement('div');
  const myChart = document.createElement('canvas');

  company.id = 'company';
  compPrice.id = 'compPrice';
  compImage.id = 'compImage';
  name.id = 'name';
  compDescription.id = 'compDescription';
  link.id = 'link';
  changes.id = 'changes';
  myChart.id = 'myChart';

  link.textContent = 'Visit our site';
  link.target = '_blank';

  company.classList.add('company');
  compImage.classList.add('company-img');
  name.classList.add('company-name');
  compDescription.classList.add('company-description');
  link.classList.add('company-link');
  compPrice.classList.add('company-price');
  compDescription.classList.add('company-description');
  graph.classList.add('graph');
  container.classList.add('container');
  graph.classList.add('graph');

  graph.append(container);
  container.append(myChart);
  myChart.getContext('2d');

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
};

const getCompanyProfile = async (symbol) => {
  const spinner = document.getElementById('spinner');
  try {
    spinner.classList.remove('hidden');
    const res = await fetch(`${COMP_URL}${symbol}`);
    const data = await res.json();
    displayCompany(data.profile);
  } catch (error) {
    console.error(error);
  } finally {
    spinner.classList.add('hidden');
  }
};

const displayCompany = (comp) => {
  const { image, companyName, description, website, changesPercentage, price } =
    comp;
  document.getElementById('compImage').src = image;
  document.getElementById('name').innerText = companyName;
  compDescription.innerText = description;
  compPrice.innerText = `Stock price $${price}`;
  link.href = website;
  const changes = document.getElementById('changes');
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
  fetchHistoricData();
};

const fetchHistoricData = async () => {
  try {
    const res = await fetch(`${HISTORIC_URL}${symbol}${SERIE}`);
    const data = await res.json();
    spinner.classList.add('hidden');
    const dates = [];
    const prices = [];
    data.historical.slice(0, 100).map((entry) => dates.push(entry.date));
    data.historical.slice(0, 100).map((entry) => prices.push(entry.close));
    const stocksChart = new Chart(myChart, {
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
};

(() => {
  makeElements();
  getCompanyProfile(symbol);
})();
