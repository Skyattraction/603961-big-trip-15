import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const MAX_DAY_GAP = 2;
const MAX_TIME_GAP = 59;
export const cityNames = ['Paris', 'Milan', 'Madrid', 'Rome', 'Tokyo', 'New York', 'Moscow', 'Prague', 'Sidney'];
export const eventTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const sentence = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';
const phrases = sentence.split('. ');

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateMockType = () => {
  const randomIndex = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[randomIndex];
};

const generateMockName = () => {
  const randomIndex = getRandomInteger(0, cityNames.length - 1);
  return cityNames[randomIndex];
};

export const generateMockDescription = () => {
  const randomPhraseNumber = getRandomInteger(1, 5);
  const descriptionsArray = [];

  for(let i = 1; i <= randomPhraseNumber; i++) {
    const randomIndex = getRandomInteger(0, phrases.length - 1);
    const randomPhrase = phrases[randomIndex];
    descriptionsArray.push(randomPhrase);
  }

  const generatedDescription = descriptionsArray.join('. ') ;
  return `${generatedDescription}.`;
};

const generateMockOptions = () => {
  const randomOptionsNumber = getRandomInteger(1, 3);
  const options = [];

  for(let i = 1; i <= randomOptionsNumber; i++) {
    const optionItem = new Object();
    const randomIndex = getRandomInteger(0, phrases.length - 1);

    optionItem.title = phrases[randomIndex];
    optionItem.price = getRandomInteger(10, 100);
    options.push(optionItem);
  }

  return options;
};

export const generateMockOffer = () => {
  const randomOffersNumber = getRandomInteger(0, 5);
  const offers = [];

  for(let i = 1; i <= randomOffersNumber; i++) {
    const offerItem = new Object();
    offerItem.type = generateMockType();
    offerItem.offers = generateMockOptions();
    offers.push(offerItem);
  }

  return offers;
};

export const generateMockPictures = () => {
  const randomPicturesNumber = getRandomInteger(0, 3);
  const pictures = [];

  for(let i = 1; i <= randomPicturesNumber; i++) {
    const pictureItem = new Object();
    pictureItem.src = `http://picsum.photos/300/200?r=${Math.random()}`;
    pictureItem.description = generateMockDescription();
    pictures.push(pictureItem);
  }

  return pictures;
};

const generateDate = () => {
  const daysGap = getRandomInteger(-MAX_DAY_GAP, MAX_DAY_GAP);
  const hoursGap = getRandomInteger(0, MAX_TIME_GAP);
  const minutesGap = getRandomInteger(0, MAX_TIME_GAP);

  return dayjs().add(daysGap, 'day').add(hoursGap, 'hour').add(minutesGap, 'minute').toDate();
};

export const generateEventTypeList = (id, type) => {
  let typeList = '';
  for (const eventType in eventTypes) {
    typeList += `<div class="event__type-item">
    <input id="event-type-${eventTypes[eventType]}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypes[eventType]}" ${type === eventTypes[eventType]? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${eventTypes[eventType]}" for="event-type-${eventTypes[eventType]}-${id}">${eventTypes[eventType]}</label>
  </div>`;
  }
  return typeList;
};

export const generateCityList = () => {
  let cityList = '';
  for (const cityName in cityNames) {
    cityList += `<option value="${cityNames[cityName]}"></option>`;
  }
  return cityList;
};

export const generateOfferList = (point) => {
  let offerList = '';

  const offer = point.offer;
  const id = point.id;

  for(let i = 0; i < offer.length; i++) {
    const selected = ((point.selectedOffers).filter((currentOffer) => currentOffer.title === offer[i].offers[0].title));

    const optionItem = `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer[i].type}-${id}"
      type="checkbox"
      name="event-offer-${offer[i].type}-${id}"
      data-title="${offer[i].offers[0].title}"
      data-price="${offer[i].offers[0].price}"
      ${selected.length > 0 ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offer[i].type}-${id}">
      <span class="event__offer-title">${offer[i].offers[0].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer[i].offers[0].price}</span>
    </label>
  </div>`;
    offerList += optionItem;
  }
  return offerList;
};

export const generatePhotosList = (pictures) => {
  let photosList = '';
  for(let i = 0; i < pictures.length; i++) {
    photosList += `<img class="event__photo" src="${pictures[i].src}" alt="${pictures[i].description}">`;
  }
  return photosList;
};

export const generateDestination = (destination) => {
  let destinationTemplate = '';

  if(destination.description || destination.pictures) {
    destinationTemplate = `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>

    ${destination.description ? `<p class="event__destination-description">${destination.description}</p>` : ''}
    ${destination.pictures ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${generatePhotosList(destination.pictures)}
      </div>
    </div>` : ''}
  </section>`;
  }
  return destinationTemplate;
};

export const generatePointInfo = () => ({
  type: generateMockType(),
  name: generateMockName(),
  offer: generateMockOffer(),
  destination: {
    description: generateMockDescription(),
    pictures: generateMockPictures(),
  },
  basePrice: getRandomInteger(100, 1000),
  dateFrom: generateDate(),
  dateTo: generateDate(),
  id: nanoid(),
  isFavorite: false,
  selectedOffers: [],
});
