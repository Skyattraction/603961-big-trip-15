import {MenuView} from './view/markup-proxy.js';
import RoutePresenter from './presenter/route.js';
import FilterPresenter from './presenter/filter.js';
import {generatePointInfo} from './mock/route-mock.js';
import {render, RenderPosition} from './utils/render.js';
import RoutePointsModel from './model/route.js';
import FilterModel from './model/filter.js';

const POINTS_COUNT = 15;
export const mockedPoints = new Array(POINTS_COUNT).fill().map(generatePointInfo);

const routePointsModel = new RoutePointsModel();
routePointsModel.setPoints(mockedPoints);
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

render(siteNavigationElement, new MenuView(), RenderPosition.BEFOREEND);

const routePresenter = new RoutePresenter(siteHeaderElement, routePointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, routePointsModel);

filterPresenter.init();
routePresenter.init();
