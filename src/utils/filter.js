import {FilterType} from '../const';
import {isPointInPast, isPointInFuture} from './route-point.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointInFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointInPast(point.dateTo)),
};
