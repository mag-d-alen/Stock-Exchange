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
    this.buttons.map((button) =>
      button.addEventListener('click', this.addToCompare)
    );
  }

  addToCompare = (e) => {
    const symbol = e.target.value;
    this.symbols.push(symbol);
    const companyToCompare = document.createElement('div');
    const deleteComp = document.createElement('button');
    companyToCompare.classList.add('company-to-compare');
    companyToCompare.innerText = symbol;
    deleteComp.classList.add('delete');
    deleteComp.id = symbol;
    deleteComp.innerText = 'X';
    deleteComp.addEventListener('click', this.removeFromCompare);
    companyToCompare.append(deleteComp);
    this.location.appendChild(companyToCompare);
    this.checkLength();
  };
  // problem with remove
  removeFromCompare = (e) => {
    const toDelete = document.getElementById(e.target.id).parentElement;
    this.location.removeChild(toDelete);
    this.symbols = this.symbols.filter((symbol) => symbol !== e.target.id);
    console.log(this.symbols);
    this.checkLength();
  };

  makeCompareLink() {
    console.log(this.symbols);
    const compare = document.createElement('a');
    compare.id = 'compare';
    compare.classList.add('compare-link');
    this.location.insertAdjacentElement('afterend', compare);
  }

  checkLength() {
    console.log(this.symbols.length);
    const compare = document.getElementById('compare');
    if (this.symbols.length >= 1 || this.symbols.length > 3) {
      compare.innerText = '';
      compare.href = '';
    }
    if (this.symbols.length === 2) {
      compare.innerText = `Compare ${this.symbols.length} companies`;
      compare.href = `compare.html?symbols=${this.symbols}`;
    }
    if (this.symbols.length < 3) {
      this.buttons.forEach((button) => button.classList.remove('hidden'));
    }
    if (this.symbols.length === 3) {
      compare.innerText = `Compare ${this.symbols.length} companies`;
      compare.href = `../compare.html?symbols=${this.symbols}`;
      this.buttons.forEach((button) => button.classList.add('hidden'));
    }
  }
}
