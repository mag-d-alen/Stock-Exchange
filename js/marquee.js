/** @format */
const marqueeFetch = async () => {
  try {
    const res = await fetch(MARQUEE_URL);
    const data = await res.json();
    createMarquee(data);
  } catch (error) {
    console.error(error.message);
  }
};

const createMarquee = (data) => {
  const marquee = document.getElementById('marquee');
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
    marquee.append(marqueeItem);
  });
};
