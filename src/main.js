import {
  FiltersView,
  MenuView
} from './view/markup-proxy.js';
import RoutePresenter from './presenter/route.js';
import {generatePointInfo} from './mock/route-mock.js';
import {render, RenderPosition} from './utils/render.js';

const POINTS_COUNT = 15;
const mockedPoints = new Array(POINTS_COUNT).fill().map(generatePointInfo);

const siteHeaderElement = document.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const routePresenter = new RoutePresenter(siteHeaderElement);

render(siteNavigationElement, new MenuView(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FiltersView(), RenderPosition.BEFOREEND);

routePresenter.init(mockedPoints);
