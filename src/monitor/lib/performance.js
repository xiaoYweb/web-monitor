import { sleep } from '../utils';


export default function performance() {
  const { report, frequency: { performance } } = this;

  window.addEventListener('load', () => {
    const willdo = Math.random() < performance;
    const timestamp = String(Date.now())
    willdo && sleep(10 * 1000).then(() => {
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
        secureConnectionStart,
        domContentLoadedEventEnd,
      } = window?.performance?.timing || {};


      const payload = {
        type: 'performance',
        // loadTime: loadEventEnd - fetchStart, // Total time from start to load
        // domReadyTime: domComplete - domInteractive, // Time spent constructing the DOM tree 解析dom树耗时 
        // readyStart: fetchStart - navigationStart, // Time consumed preparing the new page
        // redirectTime: redirectEnd - redirectStart, // Time spent during redirection
        // appcacheTime: domainLookupStart - fetchStart, // AppCache
        // unloadEventTime: unloadEventEnd - unloadEventStart, // Time spent unloading documents
        // loadEventTime: loadEventEnd - loadEventStart, // Load event time
        // operationTime: loadEventEnd - navigationStart,// domready时间(用户可操作时间节点) 

        firstPaintTime: responseStart - navigationStart, // 首次渲染时间(白屏时间) FPT 从请求开始到浏览器开始解析第一批HTML文档字节的时间差
        timeInteract: domInteractive - fetchStart, // 首次可交互时间 浏览器完成所有HTML解析并且完成DOM构建，此时浏览器开始加载资源。
        domReadyTime: domContentLoadedEventEnd - fetchStart, // HTML加载完成时间， 即DOM Ready时间。
        loadTime: loadEventStart - fetchStart, // 页面完全加载时间 Load=首次渲染时间+DOM解析耗时+同步JS执行+资源加载耗时。

        lookupDomainTime: domainLookupEnd - domainLookupStart, // DNS query time DNS查询耗时
        connectTime: connectEnd - connectStart, // TCP connection time TCP链接耗时
        requestTime: responseEnd - requestStart, // Time spent during the request request请求耗时  请求响应耗时
        transactionTime: responseEnd - responseStart, // 内容传输耗时
        initDomTreeTime: domInteractive - responseEnd, // Request to completion of the DOM loading DOM解析耗时
        resourceTime: loadEventStart - domContentLoadedEventEnd, // 资源加载耗时
        ssl: secureConnectionStart ? connectEnd - secureConnectionStart : 0, // SSL安全连接耗时 只在HTTPS下有效。
        timestamp,
      }


      report && report(payload) // 实例挂载的 上报方法
    })

  })
}

/**
 * 1. 白屏时间（first Paint Time）——用户从打开页面开始到页面开始有东西呈现为止
 * 2. 首屏时间——用户浏览器首屏内所有内容都呈现出来所花费的时间
 * 3. 用户可操作时间(dom Interactive)——用户可以进行正常的点击、输入等操作，默认可以统计domready时间，因为通常会在这时候绑定事件操作
 * 4. 总下载时间——页面所有资源都加载完成并呈现出来所花的时间，即页面 onload 的时间
 */

function handleDelayExec(fn) {
  const domainLookupStart =  window?.performance?.timing.domainLookupStart;
  if (domainLookupStart && domainLookupStart > 0) {
    fn()
    return
  }
  
  sleep(1000).then(() => {
    handleDelayExec(fn)
  })
}

function handleReport(options, report) {
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
    secureConnectionStart,
    domContentLoadedEventEnd,
  } = window?.performance?.timing || {};


  const payload = {
    type: 'performance',
    // loadTime: loadEventEnd - fetchStart, // Total time from start to load
    // domReadyTime: domComplete - domInteractive, // Time spent constructing the DOM tree 解析dom树耗时 
    // readyStart: fetchStart - navigationStart, // Time consumed preparing the new page
    // redirectTime: redirectEnd - redirectStart, // Time spent during redirection
    // appcacheTime: domainLookupStart - fetchStart, // AppCache
    // unloadEventTime: unloadEventEnd - unloadEventStart, // Time spent unloading documents
    // loadEventTime: loadEventEnd - loadEventStart, // Load event time
    // operationTime: loadEventEnd - navigationStart,// domready时间(用户可操作时间节点) 

    firstPaintTime: responseStart - navigationStart, // 首次渲染时间(白屏时间) FPT 从请求开始到浏览器开始解析第一批HTML文档字节的时间差
    timeInteract: domInteractive - fetchStart, // 首次可交互时间 浏览器完成所有HTML解析并且完成DOM构建，此时浏览器开始加载资源。
    domReadyTime: domContentLoadedEventEnd - fetchStart, // HTML加载完成时间， 即DOM Ready时间。
    loadTime: loadEventStart - fetchStart, // 页面完全加载时间 Load=首次渲染时间+DOM解析耗时+同步JS执行+资源加载耗时。

    lookupDomainTime: domainLookupEnd - domainLookupStart, // DNS query time DNS查询耗时
    connectTime: connectEnd - connectStart, // TCP connection time TCP链接耗时
    requestTime: responseEnd - requestStart, // Time spent during the request request请求耗时  请求响应耗时
    transactionTime: responseEnd - responseStart, // 内容传输耗时
    initDomTreeTime: domInteractive - responseEnd, // Request to completion of the DOM loading DOM解析耗时
    resourceTime: loadEventStart - domContentLoadedEventEnd, // 资源加载耗时
    ssl: secureConnectionStart ? connectEnd - secureConnectionStart : 0, // SSL安全连接耗时 只在HTTPS下有效。
    ...options
  }

  typeof report === 'function' && report(payload)
}