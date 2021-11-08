/** @format */

class Compare {
  constructor(location) {
    this.location = location;
    this.symbols = [];
    this.buttons = Array.from(document.querySelectorAll('.compareBtn'));
    this.setEventListeners();
    this.makeCompareLink();
  }

  setEventListeners() {
    this.buttons &&
      this.buttons.map((button) =>
        button.addEventListener('click', this.addToCompare)
      );
  }

  addToCompare = (e) => {
    const symbol = e.target.value;
    if (!this.symbols.includes(symbol)) {
      this.symbols.push(symbol);
      const companyToCompare = document.createElement('div');
      const deleteCompany = document.createElement('button');
      companyToCompare.classList.add('company-to-compare');
      companyToCompare.innerText = symbol;
      deleteCompany.classList.add('delete');
      deleteCompany.id = symbol;
      deleteCompany.innerText = 'X';
      deleteCompany.addEventListener('click', this.removeFromCompare);
      companyToCompare.append(deleteCompany);
      this.location.appendChild(companyToCompare);
      this.checkLength();
    }
  };

  removeFromCompare = (e) => {
    const elemenToDelete = document.getElementById(e.target.id).parentElement;
    this.location.removeChild(toDelete);
    this.symbols = this.symbols.filter((symbol) => symbol != e.target.id);
    this.checkLength();
  };

  makeCompareLink() {
    const compare = document.createElement('a');
    compare.id = 'compare';
    compare.classList.add('compare-link');
    !this.location.hasChildNodes(compare) && this.location.append(compare);
  }

  checkLength() {
    const compare = document.getElementById('compare');
    if (this.symbols.length <= 1 || this.symbols.length > 3) {
      compare.innerText = '';
      compare.href = '';
    }
    if (this.symbols.length === 2) {
      compare.innerText = `Compare ${this.symbols.length} companies`;
      compare.href = `compare.html?symbols=${this.symbols}`;
      this.location.parentNode.prepend(compare);
    }
    if (this.symbols.length === 3) {
      compare.innerText = `Compare ${this.symbols.length} companies`;
      compare.href = `../compare.html?symbols=${this.symbols}`;
      this.buttons.forEach((button) => button.classList.add('hidden'));
    }
    if (this.symbols.length < 3) {
      this.buttons.forEach((button) => button.classList.remove('hidden'));
    }
  }
}
