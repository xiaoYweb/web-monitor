import recordJsError from './monitor/lib/jsError';
import recordPromiseError from './monitor/lib/promiseError';
import enhanceAjax from './monitor/lib/ajax';
import timing from './monitor/lib/timing';
import axios from 'axios';
import { getExtraInfo } from './monitor/utils/getExtraInfo';

export default class WebMonitor {
  constructor(props) {
    const { allowApiList = [], report, onoceReport = {}, appName } = props;
    
    const defaultOnceReport = {
      ajax: 5,
      jsError: 1,
      promiseError: 5,
    }

    this.allowApiList = allowApiList || []; // 允许上报的 /api   包含关系
    this.report = (params) => {
      report({ ...params, appName, ...getExtraInfo() })
    };
    this.onoceReport = Object.assign(defaultOnceReport, onoceReport);
  }

  init() {
    this.recordJsError()
    this.recordPromiseError()
    this.enhanceAjax()
    this.timing()
  }
  
  enhanceAjax(...r) {
    enhanceAjax.apply(this, r)
  }
  recordJsError(...r) {
    recordJsError.apply(this, r)
  }
  recordPromiseError(...r) {
    recordPromiseError.apply(this, r)
  }
  timing(...r) {
    timing.apply(this, r)
  }
  // enhanceAjax
  // recordJsErrorå
  // recordPromiseError
  // timing
}

window._userName = 'testName';
window._userId = 'testId';
new WebMonitor({
  appName: 'Test',
  report: (payload) => { // 上报内容
    console.log('report --> payload', payload)
    axios.post('http://127.0.0.1:7001/api/report', payload)
  },
  allowApiList: ['/self'], // 允许上报的 /api 包含关系 
}).init()
