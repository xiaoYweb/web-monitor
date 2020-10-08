import recordJsError from  './lib/jsError';
import recordPromiseError from './lib/promiseError';
import enhanceAjax from './lib/ajax';
import timing from './lib/timing';

export default class WebMonitor {
  constructor() {
    this.init()
  }

  init() {
    recordJsError()
    recordPromiseError()
    enhanceAjax()
    timing()
  }
}