import dayjs from 'dayjs';
import {generateDuration, generateFinalPrice} from '../utils/route-point.js';
import AbstractView from './abstract.js';

const createRoutePointTemplate = (point) => {
  const {dateFrom, dateTo, type, name, basePrice, offer, isFavorite} = point;
  const dateLabel = dateFrom !== null
    ? dayjs(dateFrom).format('YYYY-MM-DD')
    : '';
  const date = dateFrom !== null
    ? dayjs(dateFrom).format('MMM D')
    : '';
  const dateFromTime = dateFrom !== null
    ? dayjs(dateFrom).format('HH:mm')
    : '';
  const dateFromTimeLabel = dateFrom !== null
    ? dayjs(dateFrom).format('YYYY-MM-DDTHH:mm')
    : '';
  const dateToTime = dateTo !== null
    ? dayjs(dateTo).format('HH:mm')
    : '';
  const dateToTimeLabel = dateTo !== null
    ? dayjs(dateTo).format('YYYY-MM-DDTHH:mm')
    : '';

  const generateOptions = () => {
    let options = '';
    for(let i = 0; i < offer.length; i++) {
      const optionItem = `<li class="event__offer">
        <span class="event__offer-title">${offer[i].offers[0].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer[i].offers[0].price}</span>
      </li>`;
      options = options + optionItem;
    }
    return options;
  };

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateLabel}">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFromTimeLabel}">${dateFromTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateToTimeLabel}">${dateToTime}</time>
        </p>
        <p class="event__duration">${generateDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${generateFinalPrice(basePrice, offer)}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${generateOptions()}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};


export default class RoutePoint extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createRoutePointTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }
}
