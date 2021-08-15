import dayjs from 'dayjs';

export const createRouteInfoTemplate = (points) => {
  const generateTitle = () => {
    let title = '';
    for (let i = 0; i < points.length; i++) {
      title += points[i].name;
      if(i < points.length - 1){
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
