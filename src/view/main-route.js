import {createElement} from '../utils.js';

const createMainRouteTemplate = () => '<section class="trip-main__trip-info trip-info"></section>';

export default class MainRoute {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMainRouteTemplate();
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
