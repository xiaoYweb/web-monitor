const URL = require('url')
const { selfDecodeURI, selfStringify } = require('../utils')

export default function enhanceAjax() {
  const { allowApiList, report, frequency: { apiError } } = this;

  const _XMLHttpRequest = window.XMLHttpRequest;
  const _open = _XMLHttpRequest.prototype.open;
  const _send = _XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function () { // arguments -- method, url, asunc
    const url = arguments[1];
    const requestUrl = selfDecodeURI(url)
    const method = arguments[0].toLowerCase()
    const { path } = URL.parse(requestUrl)
    
    
    if (allowApiList.some(api => path.startsWith(api))) { // 匹配是否需要 上传
      this.needReport = true;
      this._url = requestUrl;
      this._method = method;
    }
    return _open.apply(this, arguments)
  }

  XMLHttpRequest.prototype.send = function (body) { // json string 
    if (this.needReport) { // 判断是否需要 上报
      const startTime = Date.now();

      const handler = type => () => {
        const duration = Date.now() - startTime;
        const { status, statusText, response, _url: requestUrl, _method: method } = this;

        const { query } = URL.parse(requestUrl)
        
        const isSuccessStatus = (status >= 200 && status < 300) || status === 304;
        const willdo = Math.random() < apiError;
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
          response: selfStringify(response),
        }

        willdo && report && report(payload) // 实例挂载的 上报方法
      }

      this.addEventListener('load', handler('load'), false)
      this.addEventListener('error', handler('error'), false)
      this.addEventListener('abord', handler('abord'), false)
    }

    return _send.apply(this, arguments)
  }
}
