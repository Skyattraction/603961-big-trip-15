import dayjs from 'dayjs';
import {
  generateCityList,
  generateDestination,
  generateEventTypeList,
  generateOfferList,
  generateMockOffer,
  generateMockDescription,
  generateMockPictures } from '../mock/route-mock';
import SmartView from './smart.js';

const createEditPointTemplate = (point) => {
  const {id, dateFrom, dateTo, type, name, basePrice, destination, offer} = point;

  const dateFromTime = dateFrom !== null
    ? dayjs(dateFrom).format('DD/MM/YY HH:mm')
    : '';
  const dateToTime = dateTo !== null
    ? dayjs(dateTo).format('DD/MM/YY HH:mm')
    : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${generateEventTypeList(id, type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
          ${generateCityList()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFromTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateToTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
      ${offer ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${generateOfferList(offer)}
      </div>
    </section>` : ''}
    ${generateDestination(destination)}
      </section>
    </form>
  </li>`;
};

export default class EditPoint extends SmartView {
  constructor(point) {
    super();
    this._point = point;
    this._reservePoint = Object.assign({}, point);

    this._destinationInputFocusHandler = this._destinationInputFocusHandler.bind(this);
    this._destinationInputBlurHandler = this._destinationInputBlurHandler.bind(this);
    this._typeInputSelectHandler = this._typeInputSelectHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);

    this._setInnerHandlers();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.formReset);
    this.setCloseClickHandler(this._callback.closeClick);
  }

  reset() {
    this._point.name = this._reservePoint.name;
    this._point.destination.description = this._reservePoint.destination.description;
    this._point.destination.pictures = this._reservePoint.destination.pictures;
    this._point.type = this._reservePoint.type;
    this._point.offer = this._reservePoint.offer;
    this.updateData(this._reservePoint);
  }

  getTemplate() {
    return createEditPointTemplate(this._point);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('focus', this._destinationInputFocusHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('blur', this._destinationInputBlurHandler);
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._typeInputSelectHandler);
  }

  _destinationInputFocusHandler(evt) {
    evt.target.value = '';
  }

  _destinationInputBlurHandler(evt) {
    if(evt.target.value) {
      this._point.name = evt.target.value;
      this._point.destination.description = generateMockDescription();
      this._point.destination.pictures = generateMockPictures();
    }

    this.updateData({
      name: this._point.name,
      destination: {
        description: this._point.destination.description,
        pictures: this._point.destination.pictures,
      },
    });
  }

  _typeInputSelectHandler(evt) {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    this._point.type = evt.target.textContent;
    this._point.offer = generateMockOffer();

    this.updateData({
      type: this._point.type,
      offer: this._point.offer,
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._point);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteClickHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
  }
}
