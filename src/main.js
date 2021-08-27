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
import {render, RenderPosition, replace} from './utils/render.js';
import {noPointsMessage} from './utils/route-point.js';

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
    replace(siteEditPointComponent, siteRoutePointComponent);
  };

  const replaceEditFormToPoint = () => {
    replace(siteRoutePointComponent, siteEditPointComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  siteRoutePointComponent.setEditClickHandler(() => {
    replacePointToEditForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  siteEditPointComponent.setCloseClickHandler(() => {
    replaceEditFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  siteEditPointComponent.setFormSubmitHandler(() => {
    replaceEditFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointsListElement, siteRoutePointComponent, RenderPosition.BEFOREEND);
};

const renderPointsRelatedData = (points) => {
  if(points.length) {
    render(siteHeaderElement, siteMainRouteComponent, RenderPosition.AFTERBEGIN);
    render(siteMainRouteComponent, new RouteInfoView(points), RenderPosition.BEFOREEND);
    render(siteMainRouteComponent, new TotalPriceView(points), RenderPosition.BEFOREEND);
    render(siteTripEventsElement, new TripSortView(), RenderPosition.AFTERBEGIN);
    render(siteEventsListComponent, new AddNewPointView(points[0]), RenderPosition.BEFOREEND);

    for (let i = 1; i < points.length; i++) {
      renderPoint(siteEventsListComponent.getElement(), points[i]);
    }
  } else {
    render(siteTripEventsElement, new NoPointsView(noPointsMessage), RenderPosition.AFTERBEGIN);
  }
};

render(siteTripEventsElement, siteEventsListComponent, RenderPosition.BEFOREEND);
render(siteNavigationElement, new MenuView(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FiltersView(), RenderPosition.BEFOREEND);
renderPointsRelatedData(mockedPoints);
