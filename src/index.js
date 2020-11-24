import recordJsError from './monitor/lib/jsError';
import recordPromiseError from './monitor/lib/promiseError';
import enhanceAjax from './monitor/lib/ajax';
import timing from './monitor/lib/timing';
import axios from 'axios';

export default class WebMonitor {
  constructor(props) {
    const { allowApiList = [], report } = props;
    
    this.allowApiList = allowApiList || []; // 允许上报的 /api   包含关系
    this.report = report;
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

let once = false

new WebMonitor({
  report: (payload) => { // 上报内容
    console.log('report --> payload', payload)
    // !once && axios.post('http://127.0.0.1:7001/api/report', payload)
    // once = true
    axios.post('http://127.0.0.1:7001/api/report', payload)
  },
  allowApiList: ['/local'] // 允许上报的 /api 包含关系 
}).init()

function throttle(wait = 300) {
  let prevTime = Date.now()
  return function () {
    let currentTime = Date.now()
    if (currentTime - prevTime > wait) {

    }
  }
}