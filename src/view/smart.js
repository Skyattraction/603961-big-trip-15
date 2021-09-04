import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    if(parent) {
      this.removeElement();
      const newElement = this.getElement();
      parent.replaceChild(newElement, prevElement);
    }


    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
