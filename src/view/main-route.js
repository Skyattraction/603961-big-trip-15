import AbstractView from './abstract.js';

const createMainRouteTemplate = () => '<section class="trip-main__trip-info trip-info"></section>';

export default class MainRoute extends AbstractView {
  getTemplate() {
    return createMainRouteTemplate();
  }
}
