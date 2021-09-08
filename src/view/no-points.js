import AbstractView from './abstract.js';
import {noPointsMessage} from '../const.js';

const createNoPointsTemplate = (filterType) => {
  const noPointsMessageValue = noPointsMessage[filterType];
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
