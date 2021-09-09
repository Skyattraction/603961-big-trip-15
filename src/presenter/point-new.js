import {AddNewPointView} from '../view/markup-proxy.js';
import {nanoid} from 'nanoid';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointNew {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointAddComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;
    if (this._pointAddComponent !== null) {
      return;
    }

    this._pointAddComponent = new AddNewPointView();
    this._pointAddComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointAddComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointAddComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointAddComponent === null) {
      return;
    }
    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }
    remove(this._pointAddComponent);
    this._pointAddComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_TASK,
      UpdateType.MAJOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      Object.assign({id: nanoid()}, point),
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
