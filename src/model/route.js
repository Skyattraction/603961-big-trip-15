import AbstractObserver from '../utils/abstract-observer.js';

export default class RoutePoints extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
    this._offers = [];
    this._destinations = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  setOffers(updateType, offers) {
    this._offers = offers.slice();
    this._notify(updateType);
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        name: point['destination']['name'],
        basePrice: point['base_price'],
        isFavorite: point['is_favorite'],
        dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
        dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        selectedOffers: [],
      },
    );

    delete adaptedPoint['destination']['name'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'destination': {
          ...point.destination,
          'name': point.name,
        },
        'base_price': point.basePrice,
        'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
        'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
        'is_favorite': point.isFavorite,
      },
    );

    delete adaptedPoint.name;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.selectedOffers;

    return adaptedPoint;
  }
}
