import {StatsView} from '../view/markup-proxy.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UpdateType, FilterType} from '../const.js';

export default class Stats {
  constructor(statsContainer, routePointsModel, filterModel) {
    this._statsContainer = statsContainer;
    this._routePointsModel = routePointsModel;
    this._filterModel = filterModel;

    this._statsComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    const prevStatsComponent = this._statsComponent;
    this._statsComponent = new StatsView(this._routePointsModel.getPoints());
    this._routePointsModel.addObserver(this._handleModelEvent);
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.NONE);
    if (prevStatsComponent === null) {
      render(this._statsContainer, this._statsComponent, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this._statsComponent, prevStatsComponent);
    remove(prevStatsComponent);

  }

  destroy() {
    remove(this._statsComponent);
    this._routePointsModel.removeObserver(this._handleModelEvent);
    this._statsComponent = null;
  }

  _handleModelEvent() {
    this.init();
  }
}
