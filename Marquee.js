/** @format */

class Marquee {
  constructor(marquee) {
    this.marquee = document.getElementById('marquee');
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
    data.slice(0, 1500).map((item) => {
      const marqueeItem = document.createElement('div');
      const itemPrice = document.createElement('span');
      marqueeItem.classList.add('marquee-item');
      marqueeItem.innerText = item.symbol;
      itemPrice.innerText = item.price;
      Number(item.price) > 0
        ? itemPrice.classList.add('green')
        : itemPrice.classList.add('red');
      marqueeItem.append(itemPrice);
      this.marquee.append(marqueeItem);
    });
  }
}
