import {
  AddNewPointView,
  EventsListView,
  MainRouteView,
  NewEventButtonView,
  NoPointsView,
  RouteInfoView,
  TotalPriceView,
  TripSortView
} from '../view/markup-proxy.js';
import PointPresenter from './point.js';
import {render, RenderPosition} from '../utils/render.js';
import {sortDate, sortDuration, sortPrice} from '../utils/route-point.js';
import {updateItem, removeItem} from '../utils/common.js';
import {SortType, noPointsMessage} from '../const.js';

export default class Route {
  constructor(routeContainer) {
    this._routeContainer = routeContainer;
    this._mainRouteComponent = new MainRouteView();
    this._newEventButtonComponent = new NewEventButtonView();
    this._eventsListComponent = new EventsListView();
    this._routeInfoComponent = new RouteInfoView();
    this._tripSortComponent = new TripSortView();

    this._noPointsMessage = noPointsMessage;
    this._tripEventsContainer = document.querySelector('.trip-events');
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._showNewPointForm = false;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handlePointRemove = this._handlePointRemove.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleNewEventButtonClick = this._handleNewEventButtonClick.bind(this);
  }

  init(points) {
    this._points = points.slice().sort(sortDate);
    this._sourcedPoints = points.slice().sort(sortDate);
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    this._renderRoute();
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._sourcedPoints = updateItem(this._sourcedPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handlePointRemove(removedPoint) {
    this._points = removeItem(this._points, removedPoint);
    this._sourcedPoints = removeItem(this._sourcedPoints, removedPoint);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearPointsList();
    this._renderPointsList(this._points);
  }

  _handleNewEventButtonClick(showNewPointForm) {
    if(!showNewPointForm) {
      showNewPointForm = true;
      this._showNewPointForm = showNewPointForm;
      this._addNewPoint(showNewPointForm);
    }
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortDuration);
        break;
      case SortType.PRICE:
        this._points.sort(sortPrice);
        break;
      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _renderSort() {
    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handlePointChange, this._handlePointRemove, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _clearPointsList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderPointsList(points) {
    for (let i = 1; i < points.length; i++) {
      this._renderPoint(points[i]);
    }
  }

  _renderNoPoints(message) {
    render(this._tripEventsContainer, new NoPointsView(message), RenderPosition.AFTERBEGIN);
  }

  _addNewPoint(showNewPointForm) {
    if(showNewPointForm) {
      render(this._eventsListComponent, new AddNewPointView(), RenderPosition.AFTERBEGIN);
    }
  }

  _renderNewEventButton() {
    render(this._routeContainer, this._newEventButtonComponent, RenderPosition.BEFOREEND);
    this._newEventButtonComponent.setNewEventButtonClickHandler(this._handleNewEventButtonClick);
  }

  _renderRoute() {
    if(this._points.length) {
      render(this._routeContainer, this._mainRouteComponent, RenderPosition.AFTERBEGIN);
      this._renderNewEventButton();
      render(this._mainRouteComponent, new RouteInfoView(this._points), RenderPosition.BEFOREEND);
      render(this._mainRouteComponent, new TotalPriceView(this._points), RenderPosition.BEFOREEND);

      this._renderSort();
      this._renderPointsList(this._points);
    } else {
      this._renderNoPoints(this._noPointsMessage);
    }
  }
}
