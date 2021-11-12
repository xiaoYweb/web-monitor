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
  const { allowApiList, report } = this;
  const _fetch = fetch;


  window.fetch = function () {
    let args = [...arguments]

    // new Request 包裹的参数 只能是用一次 所以 需要克隆 
    if (arguments.length === 1 && arguments[0] instanceof Request) {
      args = [arguments[0].clone()]
    }

    return getFetchParams(arguments).then(payload => {
      const startTime = Date.now();

      return _fetch.apply(this, args)
        .then(response => {
          const { url, status, statusText, ok, headers, type } = response;
          const res = response.clone()

          try {
            res.text().then(result => {
              result = selfParse(result)
              const isSuccessStatus = ok || status === 304;
              // const isSuccessStatus = (status >= 200 && status < 300) || status === 304;

              if (typeof path === 'string' && allowApiList.some(api => path.startsWith(api))) {
                Object.assign(payload, {
                  isSuccess: isSuccessStatus ? 0 : -1,
                  response: selfStringify(result),
                  status,
                  statusText,
                  duration: Date.now() - startTime,
                })

                report && report(payload) // 实例挂载的 上报方法
              }
            })
          } catch (err) {

          } finally {
            report && report(payload) // 实例挂载的 上报方法
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

          report && report(payload) // 实例挂载的 上报方法

          return Promise.reject(err);
        })
    }).catch(err => {
      console.log(err)
    })
  }
}

function retFetchErrMessage(err) {
  const name = err?.name;
  const message = err?.message;
  if (!name && !message) return '接口中断';
  return (name || '') + (message || '')
}

/**
 *  fetch 传参 存在 三种 情况 
 * 1. url options 
 * 2. options
 * 3. new Request(url, options)
 * @param {*} args {}
 */
function getFetchParams(args) {
  return new Promise((resolve, reject) => {
    try {
      const defaultParams = {
        type: 'api',
        requestType: 'fetch',
        method: 'get',
        timestamp: String(Date.now()),
        // status,
        // statusText,
        // ajaxType: type, // load error abord
        // fetchType: type, // basic cors opaque
        // fetchMode: mode,
        // body, // 入参 请求体
      }

      if (args.length === 2) {
        const { query } = URL.parse(args[0])
        defaultParams.requestUrl = args[0]
        const { method, body } = args[1] || {}
        method && Object.assign(defaultParams, {
          method: method.toLowerCase(),
          body: selfParse(body),
          query
        })
        return resolve(defaultParams)
      }

      // 参数 new Request 包裹
      if (args[0] instanceof Request) {
        const { method, url } = args[0]
        const { query } = URL.parse(url)
        method && Object.assign(defaultParams, {
          method: method.toLowerCase(),
          requestUrl: url,
          query,
        })

        // 此处 获取 body内容 是  被 promise对象 包裹的  所以 
        return args[0].json().then(body => {
          defaultParams.body = body
          return resolve(defaultParams)
        })
      }

      // 参数 为 单个 options 
      const { url, method, body } = args[0]
      const { query } = URL.parse(url)
      return resolve(Object.assign(defaultParams, {
        method: method.toLowerCase(),
        requestUrl: url,
        body: selfParse(body),
        query
      }))
    } catch (err) {
      return reject(err)
    }
  })
}


/**
 * fetch 传参
 * 1. fetch(url, options)
 * 2. fetch(new Reuest(url, options))
 * {
  bodyUsed: false
  cache: "default"
  credentials: "same-origin"
  destination: ""
  headers: Headers {}
  integrity: ""
  isHistoryNavigation: false
  keepalive: false
  method: "POST"
  mode: "cors"
  redirect: "follow"
  referrer: "about:client"
  referrerPolicy: ""
  signal: AbortSignal
  aborted: false
  onabort: null
  [[Prototype]]: AbortSignal
}
 * */