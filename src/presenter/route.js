import {
  EventsListView,
  MainRouteView,
  NoPointsView,
  RouteInfoView,
  TotalPriceView,
  TripSortView
} from '../view/markup-proxy.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {sortDate, sortDuration, sortPrice} from '../utils/route-point.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';

export default class Route {
  constructor(routeContainer, routeModel, filterModel) {
    this._routeContainer = routeContainer;
    this._routeModel = routeModel;
    this._filterModel = filterModel;

    this._mainRouteComponent = new MainRouteView();
    this._eventsListComponent = new EventsListView();

    this._tripSortComponent = null;
    this._noPointsComponent = null;
    this._tripEventsContainer = document.querySelector('.trip-events');
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._filterType = FilterType.EVERYTHING;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._eventsListComponent, this._handleViewAction);
  }

  init(update) {
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
    this._routeModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderRoute(update);
  }

  destroy() {
    this._clearRoute({resetSortType: true});

    remove(this._eventsListComponent);

    this._routeModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._routeModel.getPoints();
    const filteredPoints = filter[this._filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortDuration);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }
    return filteredPoints.sort(sortDate);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._routeModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._routeModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._routeModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearRoute({resetHeader: true});
        this._renderRoute();
        break;
      case UpdateType.MAJOR:
        this._clearRoute({resetSortType: true, resetHeader: true});
        this._renderRoute();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearRoute();
    this._renderRoute();
  }

  createNewPoint(callback) {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPointsList(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    this._noPointsComponent = new NoPointsView(this._filterType);
    render(this._tripEventsContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _clearRoute({resetSortType = false, resetHeader = false} = {}) {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._tripSortComponent);
    if (resetHeader) {
      remove(this._mainRouteComponent);
    }
    if (this._noPointsComponent) {
      remove(this._noPointsComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderRoute(isHeaderUpdated) {
    const routePoints = this._getPoints();
    if(routePoints.length) {
      render(this._routeContainer, this._mainRouteComponent, RenderPosition.AFTERBEGIN);
      if(!isHeaderUpdated) {
        render(this._mainRouteComponent, new RouteInfoView(routePoints), RenderPosition.BEFOREEND);
        render(this._mainRouteComponent, new TotalPriceView(routePoints), RenderPosition.BEFOREEND);
      }
      this._renderSort();
      this._renderPointsList(routePoints);
    } else {
      this._renderNoPoints(this._noPointsMessage);
    }
  }
}
