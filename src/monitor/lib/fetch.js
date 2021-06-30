const URL = require('url')
const { selfDecodeURI, selfParse, selfStringify } = require('../utils')
/**
 * type basic cors opaque
 * ok boolean
 * mode 请求模式 cors no-cors same-origin
 * credentials omit same-origin include
 */

export default function enhanceFetch() {
  if (!window.fetch) return
  const { allowApiList, report, frequency: { apiError } } = this;
  const _fetch = fetch;

  window.fetch = function () {
    const url = arguments[0]
    const requestUrl = selfDecodeURI(url)
    const { query, path } = URL.parse(requestUrl)

    const defaultParams = {
      method: 'get',
    }
    Object.assign(defaultParams, arguments[1] || {})
    const startTime = Date.now();
    const method = defaultParams.method?.toLowerCase() || 'get';
    const body = defaultParams.body;
    const willdo = Math.random() < apiError;

    const payload = {
      type: 'api',
      requestType: 'fetch',
      // duration,
      requestUrl,
      query,
      method,
      // status,
      // statusText,
      // ajaxType: type, // load error abord
      // fetchType: type, // basic cors opaque
      // fetchMode: mode,
      body, // 入参 请求体
    }
    return _fetch.apply(this, arguments)
      .then(response => {
        const { url, status, statusText, ok, headers, type } = response;
        const res = response.clone()

        try {
          res.text().then(result => {
            result = selfParse(result)
            const isSuccessStatus = ok || status === 304;
            // const isSuccessStatus = (status >= 200 && status < 300) || status === 304;

            if (allowApiList.some(api => path.startsWith(api))) {
              Object.assign(payload, {
                isSuccess: isSuccessStatus ? 0 : -1,
                response: selfStringify(result),
                status,
                statusText,
                duration: Date.now() - startTime,
              })
  
              willdo && report && report(payload) // 实例挂载的 上报方法
            }
          })
        } catch (err) {

        } finally {
          // willdo && report && report(payload) // 实例挂载的 上报方法
        }

        return response;
      })
      .catch(err => {

        Object.assign(payload, {
          duration: Date.now() - startTime,
          status: -1,
          statusText: retFetchErrMessage(err),
          isSuccess: -1,
        })

        willdo && report && report(payload) // 实例挂载的 上报方法

        return Promise.reject(err);
      })
  }
}

function retFetchErrMessage(err) {
  const name = err?.name;
  const message = err?.message;
  if (!name && !message) return '接口中断';
  return (name || '') + (message || '')
}
