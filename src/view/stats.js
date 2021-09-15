
import AbstractView from './abstract.js';
import {generateEventTypesList, renderMoneyChart, renderTypeChart, renderTimeChart} from '../utils/stats.js';
import {BAR_HEIGHT} from '../const.js';

const createStatsTemplate = () => `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
  </div>
</section>`;

export default class Stats extends AbstractView {
  constructor(points) {
    super();

    this._data = points;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;
    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  _setCharts() {
    const points = this._data;
    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    this._moneyChart = renderMoneyChart(moneyCtx, points);
    this._typeChart = renderTypeChart(typeCtx, points);
    this._timeChart = renderTimeChart(timeCtx, points);

    const quantity = generateEventTypesList(points).length;

    moneyCtx.height = BAR_HEIGHT * quantity;
    typeCtx.height = BAR_HEIGHT * quantity;
    timeCtx.height = BAR_HEIGHT * quantity;
  }
}
