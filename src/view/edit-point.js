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
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createEditPointTemplate = (data) => {
  const {id, dateFrom, dateTo, type, name, basePrice, destination, offer} = data;

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
        ${generateOfferList(offer, id)}
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
    this._data = point;
    this._reserveData = Object.assign({}, point);
    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._priceInputChangeHandler = this._priceInputChangeHandler.bind(this);
    this._destinationInputFocusHandler = this._destinationInputFocusHandler.bind(this);
    this._destinationInputBlurHandler = this._destinationInputBlurHandler.bind(this);
    this._typeInputSelectHandler = this._typeInputSelectHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerStart();
    this._setDatepickerEnd();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickerStart();
    this._setDatepickerEnd();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.formReset);
    this.setCloseClickHandler(this._callback.closeClick);
  }

  reset() {
    this.updateData(this._reserveData);
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  _setDatepickerStart() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    this._datepickerStart = flatpickr(
      this.getElement().querySelector('input[name=event-start-time]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        maxDate: this._data.dateTo,
        enableTime: true,
        'time_24hr': true,
        onChange: this._dateStartChangeHandler,
      },
    );
  }

  _setDatepickerEnd() {
    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }

    this._datepickerEnd = flatpickr(
      this.getElement().querySelector('input[name=event-end-time]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        minDate: this._data.dateFrom,
        enableTime: true,
        'time_24hr': true,
        onChange: this._dateEndChangeHandler,
      },
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceInputChangeHandler);
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

  _dateStartChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    }), true;
  }

  _dateEndChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    }), true;
  }

  _priceInputChangeHandler(evt) {
    if(evt.target.value !== this._data.basePrice) {
      this.updateData({
        basePrice: Number(evt.target.value),
      }, true);
    }
  }

  _destinationInputFocusHandler(evt) {
    evt.target.value = '';
  }

  _destinationInputBlurHandler(evt) {
    if(evt.target.value) {
      this.updateData({
        name: evt.target.value,
        destination: {
          description: generateMockDescription(),
          pictures: generateMockPictures(),
        },
      });
      return;
    }
    evt.target.value = this._data.name;
  }

  _typeInputSelectHandler(evt) {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    this.updateData({
      type: evt.target.textContent,
      offer: generateMockOffer(),
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
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
