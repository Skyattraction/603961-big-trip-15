import {
  createAddNewPointTemplate,
  createEditPointTemplate,
  createFiltersTemplate,
  createMenuTemplate,
  createRouteInfoTemplate,
  createRoutePointTemplate,
  createTotalPriceTemplate,
  createTripSortTemplate
} from './view/markup-proxy.js';

const POINTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderContainer = (container, template, place) => {
  container.insertAdjacentElement(place, template);
};

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripEventsElement = document.querySelector('.trip-events');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteMainRouteElement = document.createElement('section');
siteMainRouteElement.className = 'trip-main__trip-info trip-info';

const siteEventsListElement = document.createElement('ul');
siteEventsListElement.className = 'trip-events__list';

renderContainer(siteHeaderElement, siteMainRouteElement, 'afterbegin');
renderContainer(siteTripEventsElement, siteEventsListElement, 'beforeend');

render(siteNavigationElement, createMenuTemplate(), 'beforeend');
render(siteFiltersElement, createFiltersTemplate(), 'beforeend');
render(siteMainRouteElement, createRouteInfoTemplate(), 'beforeend');
render(siteMainRouteElement, createTotalPriceTemplate(), 'beforeend');
render(siteTripEventsElement, createTripSortTemplate(), 'afterbegin');
render(siteEventsListElement, createEditPointTemplate(), 'beforeend');
render(siteEventsListElement, createAddNewPointTemplate(), 'beforeend');

for (let i = 0; i < POINTS_COUNT; i++) {
  render(siteEventsListElement, createRoutePointTemplate(), 'beforeend');
}
