const URL = require('url')

/**
 * type basic cors opaque
 * ok boolean
 * mode 请求模式 cors no-cors same-origin
 * credentials omit same-origin include
 */

export default function enhanceFetch() {
  if (!window.fetch) return
  const { allowApiList, report } = this;
  const _fetch = fetch;

  window.fetch = function () {
    const url = arguments[0]
    const requestUrl = selfDecodeURI(url)
    const { query, path } = URL.parse(requestUrl)
    
    const defaultParams = {
      method: 'get',
    }
    Object.assign(defaultParams, arguments[1] || {})
    let record = { hasReport: false }
    const startTime = Date.now();
    const method = defaultParams.method?.toLowerCase() || 'get';
    const body = defaultParams.body
    return _fetch.apply(this, arguments)
      .then(res => {
        const { url, status, statusText, ok, headers, type } = res;

        const payload = {
          type: 'api',
          requestType: 'fetch',
          // duration,
          requestUrl,
          query,
          method,
          status,
          statusText,
          // ajaxType: type, // load error abord
          fetchType: type, // basic cors opaque
          // fetchMode: mode,
          body, // 入参 请求体
          // response: JSON.stringify(result),
        }

        const isSuccessStatus = (status >= 200 && status < 300) || status === 304;
        if (!isSuccessStatus && allowApiList.some(api => path.startsWith(api))) {
          record.hasReport = true;
          const duration = Date.now() - startTime; // 无法
          Object.assign(payload, { duration })
          report && report(payload) // 实例挂载的 上报方法
        }

        return res;
      })
      .catch(err => {
        if (!record.hasReport) {
          const payload = {
            type: 'api',
            requestType: 'fetch',
            // duration,
            requestUrl,
            query,
            method,
            status: 0,
            statusText: '',
            // ajaxType: type, // load error abord
            // fetchType: type, // basic cors opaque
            // fetchMode: mode,
            body, // 入参 请求体
            // response: JSON.stringify(result),
          }
  
          const isSuccessStatus = (status >= 200 && status < 300) || status === 304;
          if (!isSuccessStatus && allowApiList.some(api => path.startsWith(api))) {
            const duration = Date.now() - startTime; // 无法
            Object.assign(payload, { duration })
            report && report(payload) // 实例挂载的 上报方法
          }
        }

        return Promise.reject(err)
      })
  }
}

function selfDecodeURI(str) {
  try {
    str = decodeURI(str)
  } catch (err) {
    console.log('selDecodeURI --> err', err)
  }
  return str;
}