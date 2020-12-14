import recordJsError from './monitor/lib/jsError';
import recordPromiseError from './monitor/lib/promiseError';
import enhanceAjax from './monitor/lib/ajax';
import enhanceFetch from './monitor/lib/fetch';
import timing from './monitor/lib/timing';
import axios from 'axios';
import { getExtraInfo } from './monitor/utils';


export default class WebMonitor {
  constructor(props) {
    const { allowApiList, report, appName } = props;

    this.allowApiList = allowApiList || []; // 允许上报的 /api   包含关系

    const reportInfo = report || this.insideReport; // 
    this.report = (params) => {
      const payload = Object.assign(params, getExtraInfo(), { appName })
      console.log('payload', payload)
      // reportInfo(payload)
    };


  }

  insideReport(payload) {
    const reportUrl = 'http://127.0.0.1:7003/webmonitor/report';
    
    const data = encodeURI(JSON.stringify(payload))
    // const data = btoa(JSON.stringify(payload))
    const img = new Image()
   
    img.src = `${reportUrl}?data=${data}`;
  }

  init() {
    this.recordJsError()
    this.recordPromiseError()
    this.enhanceAjax()
    this.enhanceFetch()
    this.timing()
  }

  enhanceAjax(...r) {
    enhanceAjax.apply(this, r)
  }
  enhanceFetch(...r) {
    enhanceFetch.apply(this, r)
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
  // report: (payload) => { // 上报内容
  //   console.log('report --> payload', payload)
  //   axios.post('http://127.0.0.1:7003/webmonitor/report', payload).catch(err => {

  //   })
  // },
  allowApiList: ['/self'], // 允许上报的 /api 包含关系 
}).init()
