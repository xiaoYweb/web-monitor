const URL = require('url')

window.n = 0
const xx = 10
export default function enhanceAjax() {
  const { allowApiList, report } = this;

  const _XMLHttpRequest = window.XMLHttpRequest;
  const _open = _XMLHttpRequest.prototype.open;
  const _send = _XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function () { // arguments -- method, url, asunc
    const url = arguments[1];
    const requestUrl = selfDecodeURI(url)
    const method = arguments[0].toLowerCase()
    const { path } = URL.parse(requestUrl)
    
    
    window.n++
    if (window.n > xx) return
    if (allowApiList.some(api => path.startsWith(api))) { // 匹配是否需要 上传
      this.needReport = true;
      this._url = requestUrl;
      this._method = method;
    }
    return _open.apply(this, arguments)
  }

  XMLHttpRequest.prototype.send = function (body) { // json string 
    if (window.n > xx) return
    if (this.needReport) { // 判断是否需要 上报
      const startTime = Date.now();

      const handler = type => () => {
        const duration = Date.now() - startTime;
        const { status, statusText, response, _url: requestUrl, _method: method } = this;

        const { query } = URL.parse(requestUrl)
        
        const isSuccessStatus = (status >= 200 && status < 300) || status === 304;
        // 不上报成功的 接口
        if (type === 'load' && isSuccessStatus) return
        const payload = {
          type: 'api',
          requestType: 'ajax',
          duration,
          requestUrl,
          query,
          method,
          status,
          statusText,
          ajaxType: type, // load error abord
          body, // send 入参 请求体
          response: JSON.stringify(response),
        }

        report && report(payload) // 实例挂载的 上报方法
      }

      this.addEventListener('load', handler('load'), false)
      this.addEventListener('error', handler('error'), false)
      this.addEventListener('abord', handler('abord'), false)
    }

    return _send.apply(this, arguments)
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