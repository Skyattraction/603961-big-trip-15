const formatMsToTime = (duration) => {
  let days = Math.floor(duration/(86400 * 1000));
  duration -= days*(86400*1000);
  let hours = Math.floor(duration/(60 * 60 * 1000 ));
  duration -= hours * (60 * 60 * 1000);
  let minutes = Math.floor(duration/(60 * 1000));

  days = (days < 10) ? `0${days}` : days;
  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;

  return `${days > 0 ? `${days}D ` : ''}${hours > 0 ? `${hours}H ` : ''}${minutes}M`;
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

const isOnline = () => window.navigator.onLine;

export {formatMsToTime, getWeightForNull, isOnline};
