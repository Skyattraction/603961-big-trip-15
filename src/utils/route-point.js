import dayjs from 'dayjs';

const noPointsMessage = 'Click New Event to create your first point';

const generateDuration = (dateFrom, dateTo) => {
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

const generateFinalPrice = (basePrice, offer) => {
  let price = basePrice;
  for(let i = 0; i < offer.length; i++) {
    price += offer[i].offers[0].price;
  }
  return price;
};

export {generateDuration, generateFinalPrice, noPointsMessage};
