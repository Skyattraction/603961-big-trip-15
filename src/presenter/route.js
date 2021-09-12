import {
  EventsListView,
  LoadingView,
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
  constructor(routeContainer, routeModel, filterModel, api) {
    this._routeContainer = routeContainer;
    this._routeModel = routeModel;
    this._filterModel = filterModel;

    this._tripSortComponent = null;
    this._noPointsComponent = null;
    this._tripEventsContainer = document.querySelector('.trip-events');
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;
    this._api = api;

    this._mainRouteComponent = new MainRouteView();
    this._eventsListComponent = new EventsListView();
    this._loadingComponent = new LoadingView();

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

  _getOffers() {
    return this._routeModel.getOffers();
  }

  _getDestinations() {
    return this._routeModel.getDestinations();
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_VIEW:
        this._routeModel.updatePoint(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._routeModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._routeModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._routeModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data, this._getOffers(), this._getDestinations());
        this._resetHeader();
        break;
      case UpdateType.MINOR:
        this._clearRoute({resetHeader: true});
        this._renderRoute();
        break;
      case UpdateType.MAJOR:
        this._clearRoute({resetSortType: true, resetHeader: true});
        this._renderRoute();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    this._renderRoute(true);
  }

  createNewPoint(callback) {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback, this._routeModel.getOffers(), this._routeModel.getDestinations());
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, offers, destinations);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPointsList(points, offers, destinations) {
    points.forEach((point) => this._renderPoint(point, offers, destinations));
  }

  _renderNoPoints() {
    this._noPointsComponent = new NoPointsView(this._filterType);
    render(this._tripEventsContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _clearRoute({resetSortType = false, resetHeader = false} = {}) {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._tripSortComponent);
    remove(this._loadingComponent);

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

  _resetHeader() {
    const routePoints = this._getPoints();
    remove(this._mainRouteComponent);
    if(routePoints.length) {
      render(this._routeContainer, this._mainRouteComponent, RenderPosition.AFTERBEGIN);
      render(this._mainRouteComponent, new RouteInfoView(routePoints), RenderPosition.BEFOREEND);
      render(this._mainRouteComponent, new TotalPriceView(routePoints), RenderPosition.BEFOREEND);
    }
  }

  _renderRoute(isHeaderUpdated) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const routePoints = this._getPoints();
    const routeOffers = this._getOffers();
    const routeDestinations = this._getDestinations();

    if(routePoints.length) {
      render(this._routeContainer, this._mainRouteComponent, RenderPosition.AFTERBEGIN);
      if(!isHeaderUpdated) {
        render(this._mainRouteComponent, new RouteInfoView(routePoints), RenderPosition.BEFOREEND);
        render(this._mainRouteComponent, new TotalPriceView(routePoints), RenderPosition.BEFOREEND);
      }
      this._renderSort();
      this._renderPointsList(routePoints, routeOffers, routeDestinations);
    } else {
      this._renderNoPoints(this._noPointsMessage);
    }
  }
}
