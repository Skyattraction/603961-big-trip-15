import {
  AddNewPointView,
  EditPointView,
  EventsListView,
  FiltersView,
  MainRouteView,
  MenuView,
  NoPointsView,
  RouteInfoView,
  RoutePointView,
  TotalPriceView,
  TripSortView
} from './view/markup-proxy.js';
import {generatePointInfo} from './mock/route-mock.js';
import {render, RenderPosition} from './utils.js';

const POINTS_COUNT = 15;
const mockedPoints = new Array(POINTS_COUNT).fill().map(generatePointInfo);
const noPointsMessage = 'Click New Event to create your first point';

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

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onCloseArrowClick = () => {
    replaceEditFormToPoint();
    siteEditPointComponent.getElement().querySelector('.event__rollup-btn').removeEventListener('click', onCloseArrowClick);
  };

  siteRoutePointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToEditForm();
    document.addEventListener('keydown', onEscKeyDown);
    siteEditPointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', onCloseArrowClick);
  });

  siteEditPointComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceEditFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
    siteEditPointComponent.getElement().querySelector('.event__rollup-btn').removeEventListener('click', onCloseArrowClick);
  });

  render(pointsListElement, siteRoutePointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderPointsRelatedData = (points) => {
  if(points.length) {
    render(siteHeaderElement, siteMainRouteComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(siteMainRouteComponent.getElement(), new RouteInfoView(points).getElement(), RenderPosition.BEFOREEND);
    render(siteMainRouteComponent.getElement(), new TotalPriceView(points).getElement(), RenderPosition.BEFOREEND);
    render(siteTripEventsElement, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);
    render(siteEventsListComponent.getElement(), new AddNewPointView(points[0]).getElement(), RenderPosition.BEFOREEND);

    for (let i = 1; i < points.length; i++) {
      renderPoint(siteEventsListComponent.getElement(), points[i]);
    }
  } else {
    render(siteTripEventsElement, new NoPointsView(noPointsMessage).getElement(), RenderPosition.AFTERBEGIN);
  }
};

render(siteTripEventsElement, siteEventsListComponent.getElement(), RenderPosition.BEFOREEND);
render(siteNavigationElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
renderPointsRelatedData(mockedPoints);
