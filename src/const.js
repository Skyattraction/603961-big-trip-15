const BAR_HEIGHT = 55;
const SHAKE_ANIMATION_TIMEOUT = 600;
const SHOW_TIME = 5000;

const AUTHORIZATION = 'Basic tj8sd3dfDscloya2j';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const OFFERS_PREFIX = 'offers';
const DESTINATIONS_PREFIX = 'destinations';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const OFFERS_STORE_NAME = `${STORE_PREFIX}-${OFFERS_PREFIX}-${STORE_VER}`;
const DESTINATIONS_STORE_NAME = `${STORE_PREFIX}-${DESTINATIONS_PREFIX}-${STORE_VER}`;

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

const UserAction = {
  UPDATE_LOCAL: 'UPDATE_LOCAL',
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
  NONE: 'none',
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

export {
  BAR_HEIGHT,
  SHAKE_ANIMATION_TIMEOUT,
  SHOW_TIME,
  AUTHORIZATION,
  END_POINT,
  STORE_NAME,
  OFFERS_STORE_NAME,
  DESTINATIONS_STORE_NAME,
  Method,
  SuccessHTTPStatusRange,
  UserAction,
  UpdateType,
  SortType,
  FilterType,
  NoPointsMessage,
  MenuItem,
  Mode,
  State
};
