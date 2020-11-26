import recordJsError from './monitor/lib/jsError';
import recordPromiseError from './monitor/lib/promiseError';
import enhanceAjax from './monitor/lib/ajax';
import timing from './monitor/lib/timing';
import axios from 'axios';

export default class WebMonitor {
  constructor(props) {
    const { allowApiList = [], report, onceReport = {}, appName } = props;

    const defaultOnceReport = {
      api: 5, // n 接口/次 上报频率
      jsError: 1,
      resourceError: 2,
      promiseError: 5,
      timing: 1,
    }
    this.onceReport = Object.assign(defaultOnceReport, onceReport);
    this.allowApiList = allowApiList || []; // 允许上报的 /api   包含关系
    
    this.report = (params) => {
      report(params?.map(item => ({...item, appName})))
    };


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

// ------------- 下方代码 build 后 需要注释 ------------------------------------------
window._userInfo = {
  userName: 'testName',
  userId: 'testId',
};
new WebMonitor({
  appName: 'Test',
  report: (payload) => { // 上报内容
    console.log('report --> payload', payload)
    axios.post('http://127.0.0.1:7001/api/report', payload)
  },
  allowApiList: ['/self'], // 允许上报的 /api 包含关系 
}).init()
