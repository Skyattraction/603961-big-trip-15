import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const createRouteInfoTemplate = (points) => {
  const generateTitle = () => {
    const routePoints = points.slice();
    let title = '';
    if (routePoints.length > 3) {
      routePoints.splice(1, points.length - 2);
      routePoints.splice(1, 0 , {name: '...'});
    }
    for (let i = 0; i < routePoints.length; i++) {
      title += routePoints[i].name;
      if(i < routePoints.length - 1){
        title += ' &mdash; ';
      }
    }
    return title;
  };
  const generateDates = () => {
    const datesFrom = points[0].dateFrom;
    const datesTo = points[points.length-1].dateTo;
    let datesToEnding = '';
    const datesFromStarting = datesFrom !== null
      ? dayjs(datesFrom).format('MMM D')
      : '';

    if(datesTo !== null) {
      if(dayjs(datesFrom).format('MMM') === dayjs(datesTo).format('MMM')) {
        datesToEnding = dayjs(datesTo).format('D');
      } else {
        datesToEnding = dayjs(datesTo).format('MMM D');
      }
    }
    return `${datesFromStarting}&nbsp;&mdash;&nbsp;${datesToEnding}`;
  };

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${generateTitle()}</h1>
    <p class="trip-info__dates">${generateDates()}</p>
  </div>`;
};


export default class RouteInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._points);
  }
}
