import dayjs from 'dayjs';
import he from 'he';
import flatpickr from 'flatpickr';
import {
  generateCityList,
  generateDestination,
  generateEventTypeList,
  generateOfferList,
  generateMockOffer,
  generateMockDescription,
  generateMockPictures
} from '../mock/route-mock';
import {cityList} from '../utils/common.js';
import SmartView from './smart.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createEditPointTemplate = (data) => {
  const {id, dateFrom, dateTo, type, name, basePrice, destination, offer, isDisabled} = data;
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

        <button class="event__save-btn  btn  btn--blue" ${isDisabled ? 'disabled' : ''} type="submit">Save</button>
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
  constructor(data) {
    super();
    this._data = EditPoint.parsePointToData(data);
    this._reserveData = Object.assign({}, data);
    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._priceInputChangeHandler = this._priceInputChangeHandler.bind(this);
    this._priceInputValidationHandler = this._priceInputValidationHandler.bind(this);
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

  removeElement() {
    super.removeElement();
    this._resetDatepicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickerStart();
    this._setDatepickerEnd();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseClickHandler(this._callback.closeClick);
  }

  reset() {
    this.updateData(this._reserveData);
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  _resetDatepicker() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }
    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }
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
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceInputValidationHandler);
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

    if(evt.target.value === '') {
      this.updateData({
        isDisabled: true,
      });
      return;
    }
    this.updateData({
      isDisabled: false,
    });
  }

  _priceInputValidationHandler(evt) {
    const numbers = /^\d+$/;
    if((((evt.target.value).match(numbers) !== null) && (evt.target.value > 0)) || evt.target.value === '') {
      evt.target.setCustomValidity('');
    } else {
      evt.target.setCustomValidity('Only numbers allowed');
      evt.target.value = this._data.basePrice;
    }

    evt.target.reportValidity();
  }

  _destinationInputFocusHandler(evt) {
    evt.target.value = '';
  }

  _destinationInputBlurHandler(evt) {
    if(evt.target.value) {
      if(cityList().includes(he.encode(evt.target.value))) {
        evt.target.setCustomValidity('');
        this.updateData({
          name: evt.target.value,
          destination: {
            description: generateMockDescription(),
            pictures: generateMockPictures(),
          },
        });
      } else {
        evt.target.setCustomValidity('Please select city from the list');
      }
    } else {
      evt.target.setCustomValidity('');
      evt.target.value = this._data.name;
    }

    evt.target.reportValidity();
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
    this._callback.deleteClick(EditPoint.parseDataToPoint(this._data));
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
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteClickHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {isDisabled: point.name === '' || point.basePrice === ''},
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.isDisabled;
    return data;
  }
}
