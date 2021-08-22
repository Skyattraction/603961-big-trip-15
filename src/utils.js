import dayjs from 'dayjs';

export const generateDuration = (dateFrom, dateTo) => {
  const diff = dateTo.diff(dateFrom);

  switch (true) {
    case (diff <= 59) :
      return 'Date Error';
    case (diff / 60000 / 60) < 1:
      return dayjs(diff).format('mm[M]');
    case (diff / 60000 / 60) >= 1 && (diff / 60000 / 60) < 24:
      return dayjs(diff).format('HH[H] mm[M]');
    default:
      return dayjs(diff).format('DD[D] HH[H] mm[M]');
  }
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
