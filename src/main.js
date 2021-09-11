import {MenuView} from './view/markup-proxy.js';
import RoutePresenter from './presenter/route.js';
import FilterPresenter from './presenter/filter.js';
import StatsPresenter from './presenter/stats.js';
import {render, RenderPosition} from './utils/render.js';
import RoutePointsModel from './model/route.js';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType} from './const.js';
import Api from './api.js';

let isJustRouteUpdated;

const AUTHORIZATION = 'Basic tjds53dfSsclosa2j';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.trip-main');
const sitePageContainerElement = document.querySelector('.page-main .page-body__container');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const newEventButtonComponent = siteHeaderElement.querySelector('.trip-main__event-add-btn');

const api = new Api(END_POINT, AUTHORIZATION);

const routePointsModel = new RoutePointsModel();
const filterModel = new FilterModel();

const siteMenuComponent = new MenuView(MenuItem.TABLE);

const routePresenter = new RoutePresenter(siteHeaderElement, routePointsModel, filterModel, api);
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

filterPresenter.init();
routePresenter.init();

api.getOffers()
  .then((offers) => {
    routePointsModel.setOffers(UpdateType.MINOR, offers);
  })
  .catch(() => {
    routePointsModel.setOffers(UpdateType.MINOR, []);
  });

api.getDestinations()
  .then((destinations) => {
    routePointsModel.setDestinations(UpdateType.MINOR, destinations);
  })
  .catch(() => {
    routePointsModel.setDestinations(UpdateType.MINOR, []);
  });

api.getPoints()
  .then((points) => {
    routePointsModel.setPoints(UpdateType.INIT, points);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(siteNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    routePointsModel.setPoints(UpdateType.INIT, []);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(siteNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
  });
