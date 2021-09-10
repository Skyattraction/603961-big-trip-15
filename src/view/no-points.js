import AbstractView from './abstract.js';
import {NoPointsMessage} from '../const.js';

const createNoPointsTemplate = (filterType) => {
  const noPointsMessageValue = NoPointsMessage[filterType];
  return (
    `<p class="trip-events__msg">${noPointsMessageValue}</p>`
  );
};

export default class NoPoints extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoPointsTemplate(this._data);
  }
}
