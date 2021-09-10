import AbstractView from './abstract.js';

const createTotalPriceTemplate = (points) => {
  const generateTotalPrice = () => {
    let price = 0;
    for (const point of points) {
      price += point.basePrice;
      (point.selectedOffers).forEach((offer) => {
        price += Number(offer.price);
      });
    }
    return price;
  };
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${generateTotalPrice()}</span>
  </p>`;
};

export default class TotalPrice extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTotalPriceTemplate(this._points);
  }
}
