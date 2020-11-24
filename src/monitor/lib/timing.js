import { sleep, handleBantchReport } from '../utils';

const cache = [];

export default function timing() {
  const { report, onoceReport } = this;

  window.addEventListener('load', () => {
    sleep(3000).then(() => {
      const {
        redirectStart,
        redirectEnd,
        fetchStart,
        loadEventStart,
        loadEventEnd,
        domComplete,
        domInteractive,
        domainLookupStart,
        domainLookupEnd,
        navigationStart,
        unloadEventStart,
        unloadEventEnd,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
      } = window.performance.timing;


      const payload = {
        loadTime: loadEventEnd - fetchStart, // Total time from start to load
        domReadyTime: domComplete - domInteractive, // Time spent constructing the DOM tree 解析dom树耗时 
        readyStart: fetchStart - navigationStart, // Time consumed preparing the new page
        redirectTime: redirectEnd - redirectStart, // Time spent during redirection
        appcacheTime: domainLookupStart - fetchStart, // AppCache
        unloadEventTime: unloadEventEnd - unloadEventStart, // Time spent unloading documents
        lookupDomainTime: domainLookupEnd - domainLookupStart, // DNS query time DNS查询耗时
        connectTime: connectEnd - connectStart, // TCP connection time TCP链接耗时
        requestTime: responseEnd - requestStart, // Time spent during the request request请求耗时
        initDomTreeTime: domInteractive - responseEnd, // Request to completion of the DOM loading
        loadEventTime: loadEventEnd - loadEventStart, // Load event time

        firstPaintTime: responseStart - navigationStart, // 白屏时间
        // operationTime: loadEventEnd - navigationStart,// domready时间(用户可操作时间节点) 
      }

      handleBantchReport({
        report, cache, payload,
        maxLength: onoceReport?.timing,
      })
      // report && report(payload)
    })

  })
}

/**
 * 1. 白屏时间（first Paint Time）——用户从打开页面开始到页面开始有东西呈现为止
 * 2. 首屏时间——用户浏览器首屏内所有内容都呈现出来所花费的时间
 * 3. 用户可操作时间(dom Interactive)——用户可以进行正常的点击、输入等操作，默认可以统计domready时间，因为通常会在这时候绑定事件操作
 * 4. 总下载时间——页面所有资源都加载完成并呈现出来所花的时间，即页面 onload 的时间
 */