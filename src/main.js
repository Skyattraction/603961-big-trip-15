import {
  AddNewPointView,
  EditPointView,
  EventsListView,
  FiltersView,
  MainRouteView,
  MenuView,
  RouteInfoView,
  RoutePointView,
  TotalPriceView,
  TripSortView
} from './view/markup-proxy.js';
import {generatePointInfo} from './mock/route-mock.js';
import {render, RenderPosition} from './utils.js';

const POINTS_COUNT = 15;
const mockedPoints = new Array(POINTS_COUNT).fill().map(generatePointInfo);

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripEventsElement = document.querySelector('.trip-events');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteMainRouteComponent = new MainRouteView();
const siteEventsListComponent = new EventsListView();

const renderPoint = (pointsListElement, point) => {
  const siteRoutePointComponent = new RoutePointView(point);
  const siteEditPointComponent = new EditPointView(point);

  const replacePointToEditForm = () => {
    pointsListElement.replaceChild(siteEditPointComponent.getElement(), siteRoutePointComponent.getElement());
  };

  const replaceEditFormToPoint = () => {
    pointsListElement.replaceChild(siteRoutePointComponent.getElement(), siteEditPointComponent.getElement());
  };

  siteRoutePointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToEditForm();
  });

  siteEditPointComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceEditFormToPoint();
  });

  render(pointsListElement, siteRoutePointComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteHeaderElement, siteMainRouteComponent.getElement(), RenderPosition.AFTERBEGIN);
render(siteTripEventsElement, siteEventsListComponent.getElement(), RenderPosition.BEFOREEND);
render(siteNavigationElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(siteMainRouteComponent.getElement(), new RouteInfoView(mockedPoints).getElement(), RenderPosition.BEFOREEND);
render(siteMainRouteComponent.getElement(), new TotalPriceView(mockedPoints).getElement(), RenderPosition.BEFOREEND);
render(siteTripEventsElement, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);
render(siteEventsListComponent.getElement(), new AddNewPointView(mockedPoints[0]).getElement(), RenderPosition.BEFOREEND);

for (let i = 1; i < POINTS_COUNT; i++) {
  renderPoint(siteEventsListComponent.getElement(), mockedPoints[i]);
}
