import {
  AddNewPointView,
  EventsListView,
  MainRouteView,
  NoPointsView,
  RouteInfoView,
  TotalPriceView,
  TripSortView
} from '../view/markup-proxy.js';
import PointPresenter from './point.js';
import {render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {noPointsMessage} from '../utils/route-point.js';

export default class Route {
  constructor(routeContainer) {
    this._routeContainer = routeContainer;
    this._mainRouteComponent = new MainRouteView();
    this._eventsListComponent = new EventsListView();
    this._routeInfoComponent = new RouteInfoView();
    this._tripSortComponent = new TripSortView();

    this._noPointsMessage = noPointsMessage;
    this._tripEventsContainer = document.querySelector('.trip-events');
    this._pointPresenter = new Map();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    this._renderRoute();
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handlePointChange, this._handleModeChange);
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

  _addNewPoint(point) {
    render(this._eventsListComponent, new AddNewPointView(point), RenderPosition.BEFOREEND);
  }

  _renderRoute() {
    if(this._points.length) {
      render(this._routeContainer, this._mainRouteComponent, RenderPosition.AFTERBEGIN);
      render(this._mainRouteComponent, new RouteInfoView(this._points), RenderPosition.BEFOREEND);
      render(this._mainRouteComponent, new TotalPriceView(this._points), RenderPosition.BEFOREEND);
      render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);

      this._addNewPoint(this._points[0]);
      this._renderPointsList(this._points);
    } else {
      this._renderNoPoints(this._noPointsMessage);
    }
  }
}
