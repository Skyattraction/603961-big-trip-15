import {MenuView} from './view/markup-proxy.js';
import RoutePresenter from './presenter/route.js';
import FilterPresenter from './presenter/filter.js';
import StatsPresenter from './presenter/stats.js';
import {generatePointInfo} from './mock/route-mock.js';
import {render, RenderPosition} from './utils/render.js';
import RoutePointsModel from './model/route.js';
import FilterModel from './model/filter.js';
import {MenuItem} from './const.js';

let isJustRouteUpdated;

const POINTS_COUNT = 15;
export const mockedPoints = new Array(POINTS_COUNT).fill().map(generatePointInfo);

const routePointsModel = new RoutePointsModel();
routePointsModel.setPoints(mockedPoints);
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.trip-main');
const sitePageContainerElement = document.querySelector('.page-main .page-body__container');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMenuComponent = new MenuView(MenuItem.TABLE);
const newEventButtonComponent = siteHeaderElement.querySelector('.trip-main__event-add-btn');

render(siteNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const routePresenter = new RoutePresenter(siteHeaderElement, routePointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, routePointsModel);
const statsPresenter = new StatsPresenter(sitePageContainerElement, routePointsModel);

const handleNewPointFormClose = () => {
  newEventButtonComponent.disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      isJustRouteUpdated = true;
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      routePresenter.init(isJustRouteUpdated);
      statsPresenter.destroy();

      break;
    case MenuItem.STATS:
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      routePresenter.destroy();
      statsPresenter.init();
      break;
  }
};

newEventButtonComponent.addEventListener('click', (evt) => {
  evt.preventDefault();
  routePresenter.createNewPoint(handleNewPointFormClose);
  newEventButtonComponent.disabled = true;
});

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
routePresenter.init();

