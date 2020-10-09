import recordJsError from './monitor/lib/jsError';
import recordPromiseError from './monitor/lib/promiseError';
import enhanceAjax from './monitor/lib/ajax';
import timing from './monitor/lib/timing';
import { setConfig } from './config';

export default class WebMonitor {
  constructor(props) {
    const { appName } = props;
    setConfig({ appName })
    this.init()
  }

  init() {
    recordJsError()
    recordPromiseError()
    enhanceAjax()
    timing()
  }
}