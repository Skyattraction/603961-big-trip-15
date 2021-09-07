import dayjs from 'dayjs';

const generateDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));

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

const generateFinalPrice = (basePrice, offer) => {
  let price = basePrice;
  for(let i = 0; i < offer.length; i++) {
    price += offer[i].offers[0].price;
  }
  return price;
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

  return generateFinalPrice(pointB.basePrice, pointB.offer) - generateFinalPrice(pointA.basePrice, pointA.offer);
};

const isPointInPast = (date) => date === null ? false : dayjs().isAfter(dayjs(date), 'hour');

const isPointInFuture = (date) => date === null ? false : dayjs().isBefore(dayjs(date), 'hour');

export {generateDuration, generateFinalPrice, sortDate, sortDuration, sortPrice, isPointInPast, isPointInFuture};
