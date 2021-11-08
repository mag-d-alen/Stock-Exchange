/** @format */

class CompareClasses {
  constructor(comparisonContainer) {
    this.comparisonContainer = comparisonContainer;
    this.urlParams = new URLSearchParams(window.location.search);
    this.symbols = this.urlParams.get('symbols').split(',');
  }

  displayComparedCompanies() {
    this.symbols.forEach((symbol) => {
      const companyToCompareWrapper = document.createElement('div');
      companyToCompareWrapper.classList.add('company-to-compare-wrapper');
      const comparedCompany = new Company(companyToCompareWrapper, symbol);
      this.comparisonContainer.append(companyToCompareWrapper);
    });
  }
}
