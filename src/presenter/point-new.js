import {AddNewPointView} from '../view/markup-proxy.js';
import {isOnline} from '../utils/common.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {toast} from '../utils/toast.js';
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

  init(callback, offers, destinations) {
    this._destroyCallback = callback;
    this._offers = offers;
    this._destinations = destinations;

    if (this._pointAddComponent !== null) {
      return;
    }

    this._pointAddComponent = new AddNewPointView(this._offers, this._destinations);
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

  setSaving() {
    this._pointAddComponent.updateData({
      isDisabledByLoad: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointAddComponent.updateData({
        isDisabledByLoad: false,
        isSaving: false,
      });
    };

    this._pointAddComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    if (!isOnline()) {
      this.setAborting();
      toast('You can\'t create new point offline');
      return;
    }
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
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
