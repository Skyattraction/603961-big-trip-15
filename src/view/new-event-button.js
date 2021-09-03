import AbstractView from './abstract.js';

const createNewEventButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class NewEventButton extends AbstractView {
  constructor() {
    super();

    this._newEventButtonClickHandler = this._newEventButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createNewEventButtonTemplate();
  }

  _newEventButtonClickHandler(evt) {
    this._callback.newEventButtonClick(evt.target.disabled);
    evt.target.disabled = true;
  }

  setNewEventButtonClickHandler(callback) {
    this._callback.newEventButtonClick = callback;
    this.getElement().addEventListener('click', this._newEventButtonClickHandler);
  }
}
