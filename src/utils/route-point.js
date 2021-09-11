import dayjs from 'dayjs';
import {formatMsToTime} from './common.js';

const assignCityList = (destinations) => {
  const list = [];
  destinations.forEach((point) => {
    list.push(point.name);
  });
  const resultedList = [... new Set(list)];
  return resultedList;
};

const generateCityList = (destinations) => {
  let cityList = '';
  const cityNames = assignCityList(destinations);
  for (const cityName in cityNames) {
    cityList += `<option value="${cityNames[cityName]}"></option>`;
  }
  return cityList;
};

const generateOfferList = (point) => {
  let offerList = '';
  const offer = point.offers;
  const id = point.id;
  const type = point.type;

  for(let i = 0; i < offer.length; i++) {
    const selected = ((point.selectedOffers).filter((currentOffer) => currentOffer.title === offer[i].title));

    const optionItem = `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox  visually-hidden"
      id="event-offer-${type}-${id}-${i}"
      type="checkbox"
      name="event-offer-${type}-${id}-${i}"
      data-title="${offer[i].title}"
      data-price="${offer[i].price}"
      ${selected.length > 0 ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${type}-${id}-${i}">
      <span class="event__offer-title">${offer[i].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer[i].price}</span>
    </label>
  </div>`;
    offerList += optionItem;
  }
  return offerList;
};

const generateEventTypeList = (id, type, offers) => {
  let typeList = '';
  const eventTypes = offers.map((item) => item.type);
  for (const eventType in eventTypes) {
    typeList += `<div class="event__type-item">
    <input id="event-type-${eventTypes[eventType]}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypes[eventType]}" ${type === eventTypes[eventType]? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${eventTypes[eventType]}" for="event-type-${eventTypes[eventType]}-${id}">${eventTypes[eventType]}</label>
  </div>`;
  }
  return typeList;
};

const generateDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  if (diff >= 0) {
    return formatMsToTime(diff);
  } else {
    return 'Date Error';
  }
};

const generatePhotosList = (pictures) => {
  let photosList = '';
  for(let i = 0; i < pictures.length; i++) {
    photosList += `<img class="event__photo" src="${pictures[i].src}" alt="${pictures[i].description}">`;
  }
  return photosList;
};

const generateDestination = (data) => {
  let destinationTemplate = '';

  const currentDestination = data.destination;
  if(currentDestination && Object.keys(currentDestination).length !== 0) {
    if(currentDestination.description || currentDestination.pictures) {
      destinationTemplate = `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>

      ${currentDestination.description ? `<p class="event__destination-description">${currentDestination.description}</p>` : ''}
      ${currentDestination.pictures ?
    `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${generatePhotosList(currentDestination.pictures)}
        </div>
      </div>` : ''}
    </section>`;
    }
  }

  return destinationTemplate;
};

const updateDescription = (name, destinations) => {
  const currentDestination = destinations.filter((item) => item.name === name);
  return currentDestination[0].description;
};

const updatePictures = (name, destinations) => {
  const currentDestination = destinations.filter((item) => item.name === name);
  return currentDestination[0].pictures;
};

const updateOffer = (offers, type) => {
  const relatedOffer = offers.filter((item) => item.type === type);
  return relatedOffer[0].offers;
};

const getWeightForNull = (pointA, pointB) => {
  if (pointA === null && pointB === null) {
    return 0;
  }

  if (pointA === null) {
    return 1;
  }

  if (pointB === null) {
    return -1;
  }

  return null;
};

const sortDate = (pointA, pointB) => {
  const weight = getWeightForNull(pointA.dateFrom, pointB.dateFrom);

  if (weight !== null) {
    return weight;
  }

  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortDuration = (pointA, pointB) => {
  const weight = getWeightForNull(dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)), dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)));

  if (weight !== null) {
    return weight;
  }

  return dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)) - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
};

const sortPrice = (pointA, pointB) => {
  const weight = getWeightForNull(pointA.basePrice, pointB.basePrice);

  if (weight !== null) {
    return weight;
  }

  return pointB.basePrice - pointA.basePrice;
};

const isPointInPast = (date) => date === null ? false : dayjs().isAfter(dayjs(date), 'hour');

const isPointInFuture = (date) => date === null ? false : dayjs().isBefore(dayjs(date), 'hour');

export {
  assignCityList,
  generateCityList,
  generateDestination,
  generateOfferList,
  generateEventTypeList,
  generateDuration,
  updateOffer,
  updateDescription,
  updatePictures,
  sortDate,
  sortDuration,
  sortPrice,
  isPointInPast,
  isPointInFuture
};
