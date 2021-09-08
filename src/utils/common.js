import {mockedPoints} from '../main.js';

//regenerating for future server data:
export const cityList = () => {
  const list = [];
  mockedPoints.forEach((point) => {
    list.push(point.name);
  });
  const resultedList = [... new Set(list)];
  return resultedList;
};
