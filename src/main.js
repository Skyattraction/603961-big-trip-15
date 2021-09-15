import {MenuView} from './view/markup-proxy.js';
import RoutePresenter from './presenter/route.js';
import FilterPresenter from './presenter/filter.js';
import StatsPresenter from './presenter/stats.js';
import {isOnline} from './utils/common.js';
import {render, RenderPosition} from './utils/render.js';
import {toast} from './utils/toast.js';
import RoutePointsModel from './model/route.js';
import FilterModel from './model/filter.js';
import {
  AUTHORIZATION,
  END_POINT,
  STORE_NAME,
  OFFERS_STORE_NAME,
  DESTINATIONS_STORE_NAME,
  MenuItem,
  UpdateType
} from './const.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

let isJustRouteUpdated;

const siteHeaderElement = document.querySelector('.trip-main');
const sitePageContainerElement = document.querySelector('.page-main .page-body__container');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const newEventButtonComponent = siteHeaderElement.querySelector('.trip-main__event-add-btn');

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const destinationStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store, offersStore, destinationStore);

const routePointsModel = new RoutePointsModel();
const filterModel = new FilterModel();

const siteMenuComponent = new MenuView(MenuItem.TABLE);

const routePresenter = new RoutePresenter(siteHeaderElement, routePointsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, routePointsModel);
const statsPresenter = new StatsPresenter(sitePageContainerElement, routePointsModel, filterModel);

const handleNewPointFormClose = () => {
  newEventButtonComponent.disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      isJustRouteUpdated = true;
      newEventButtonComponent.disabled = false;
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      routePresenter.init(isJustRouteUpdated);
      statsPresenter.destroy();

      break;
    case MenuItem.STATS:
      newEventButtonComponent.disabled = true;
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      routePresenter.destroy();
      statsPresenter.init();
      break;
  }
};

newEventButtonComponent.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast('You can\'t create new point offline');
    return;
  }
  routePresenter.createNewPoint(handleNewPointFormClose);
  newEventButtonComponent.disabled = true;
});

filterPresenter.init();
routePresenter.init();

apiWithProvider.getOffers()
  .then((offers) => {
    routePointsModel.setOffers(UpdateType.MINOR, offers);
  })
  .catch(() => {
    routePointsModel.setOffers(UpdateType.MINOR, []);
  });

apiWithProvider.getDestinations()
  .then((destinations) => {
    routePointsModel.setDestinations(UpdateType.MINOR, destinations);
  })
  .catch(() => {
    routePointsModel.setDestinations(UpdateType.MINOR, []);
  });

apiWithProvider.getPoints()
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

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/service-worker.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
