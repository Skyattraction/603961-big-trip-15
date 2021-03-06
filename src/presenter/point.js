import {
  EditPointView,
  RoutePointView
} from '../view/markup-proxy.js';
import {isOnline} from '../utils/common.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {toast} from '../utils/toast.js';
import {UserAction, UpdateType, Mode, State} from '../const.js';

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._routePointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleOfferClick = this._handleOfferClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, offers, destinations) {
    this._point = point;
    this._offers = offers;
    this._destinations = destinations;

    const prevPointComponent = this._routePointComponent;
    const prevPointEditComponent = this._editPointComponent;

    this._routePointComponent = new RoutePointView(this._point);
    this._editPointComponent = new EditPointView(this._point, this._offers, this._destinations);

    this._routePointComponent.setEditClickHandler(this._handleEditClick);
    this._routePointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setCloseClickHandler(this._handleCloseClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._editPointComponent.setOfferUpdateClickHandler(this._handleOfferClick);

    render(this._pointContainer, this._routePointComponent, RenderPosition.BEFOREEND);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointContainer, this._routePointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._routePointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._routePointComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._routePointComponent);
    remove(this._editPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._editPointComponent.updateData({
        isDisabledByLoad: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._editPointComponent.updateData({
          isDisabledByLoad: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editPointComponent.updateData({
          isDisabledByLoad: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._routePointComponent.shake(resetFormState);
        this._editPointComponent.shake(resetFormState);
        break;
    }
  }

  _replacePointToEditForm() {
    replace(this._editPointComponent, this._routePointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToPoint() {
    replace(this._routePointComponent, this._editPointComponent);
    this._routePointComponent.updateData(this._point);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editPointComponent.reset();
      this._replaceEditFormToPoint();
    }
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }
    this._replacePointToEditForm();
  }

  _handleCloseClick() {
    this._replaceEditFormToPoint();
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      this.setViewState(State.ABORTING);
      toast('You can\'t delete point offline');
      return;
    }
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point,
    );
  }

  _handleOfferClick(point) {
    if (!isOnline()) {
      this.setViewState(State.ABORTING);
      toast('You can\'t edit point offline');
      return;
    }
    this._changeData(
      UserAction.UPDATE_VIEW,
      UpdateType.PATCH,
      point,
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_LOCAL,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      this.setViewState(State.ABORTING);
      toast('You can\'t edit point offline');
      return;
    }
    const incomingUpdate = JSON.parse(JSON.stringify(update));
    const currentPoint = JSON.parse(JSON.stringify(this._point));
    delete incomingUpdate.type;
    delete currentPoint.type;
    delete incomingUpdate.offers;
    delete currentPoint.offers;

    const isMinorUpdate = (JSON.stringify(incomingUpdate) === JSON.stringify(currentPoint));
    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.MAJOR,
      update,
    );
  }
}
