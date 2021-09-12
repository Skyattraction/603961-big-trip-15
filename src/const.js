const BAR_HEIGHT = 55;
const SHAKE_ANIMATION_TIMEOUT = 600;

const UserAction = {
  UPDATE_VIEW: 'UPDATE_VIEW',
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const NoPointsMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const MenuItem = {
  ADD_NEW_EVENT: 'ADD_NEW_EVENT',
  TABLE: 'TABLE',
  STATS: 'STATS',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export {BAR_HEIGHT, SHAKE_ANIMATION_TIMEOUT, UserAction, UpdateType, SortType, FilterType, NoPointsMessage, MenuItem, Mode, State};
