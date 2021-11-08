/** @format */

class Marquee {
  constructor(marqueeWrapper) {
    this.marqueeWrapper = marqueeWrapper;
  }

  async fetchMarquee() {
    try {
      const res = await fetch(MARQUEE_URL);
      const data = await res.json();
      this.createMarquee(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  createMarquee(data) {
    const marquee = document.createElement('div');
    data.slice(0, 1500).map((item) => {
      marquee.classList.add('marquee');
      const marqueeItem = document.createElement('div');
      const itemPrice = document.createElement('span');
      marqueeItem.classList.add('marquee-item');
      marqueeItem.innerText = item.symbol;
      itemPrice.innerText = item.price;
      Number(item.price) > 0
        ? itemPrice.classList.add('green')
        : itemPrice.classList.add('red');
      marqueeItem.append(itemPrice);
      marquee.append(marqueeItem);
    });
    this.marqueeWrapper.append(marquee);
  }
}
