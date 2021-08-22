import {createElement} from '../utils.js';

const createTotalPriceTemplate = (points) => {
  const generateTotalPrice = () => {
    let price = 0;
    for (const point of points) {
      price += point.basePrice;
      const offer = point.offer;
      for(let i = 0; i < offer.length; i++) {
        price += offer[i].offers[0].price;
      }
    }
    return price;
  };
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${generateTotalPrice()}</span>
  </p>`;
};

export default class TotalPrice {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTotalPriceTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
