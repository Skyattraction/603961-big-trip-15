import AbstractView from './abstract.js';

const createNoPointsTemplate = (message) => (
  `<p class="trip-events__msg">${message}</p>`
);

export default class NoPoints extends AbstractView {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return createNoPointsTemplate(this._message);
  }
}
