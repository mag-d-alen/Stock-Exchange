/** @format */

class Compare {
  constructor(location) {
    this.location = location;
  }
  addToCompare(symbol) {
    const companyToCompare = document.createElement('div');
    const deleteComp = document.createElement('button');
    companyToCompare.classList.add('company-to-compare');
    companyToCompare.innerText = symbol;
    deleteComp.classList.add('delete');
    deleteComp.id = symbol;
    deleteComp.innerText = 'X';
    deleteComp.addEventListener('click', this.deleteCompany);
    companyToCompare.append(deleteComp);
    this.location.appendChild(companyToCompare);
  }

  deleteComp() {
    const toDelete = document.getElementById(e.target.id).parentElement;
    document.getElementById('compare-bar').removeChild(toDelete);
  }
  compareCompanies(e) {
    console.log(e);
  }
  init(symbol) {
    if (!symbol) return;
    console.log(symbol);
    const compareCompaniesBtn = document.createElement('button');
    compareCompaniesBtn.classList.add('btn');
    compareCompaniesBtn.addEventListener('click', this.compareCompanies);
    console.log(this.location);
    this.location.appendChild(compareCompaniesBtn);
    this.addToCompare(symbol);
  }
}
