export default function enhanceAjax() {
  const report = this?.report;
  const allowApiList = this?.allowApiList;
  const _XMLHttpRequest = window.XMLHttpRequest;
  const _open = _XMLHttpRequest.prototype.open;
  const _send = _XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function () { // arguments -- method, url, asunc
    const url = arguments[1];
    // console.log("🚀 ~ file: ajax.js ~ line 11 ~ enhanceAjax ~ url", url)
    
    if (allowApiList.some(api => url.includes(api))) { // 匹配是否需要 上传
      this.needReport = true;
      this._url = url;
    }
    return _open.apply(this, arguments)
  }

  XMLHttpRequest.prototype.send = function (body) { // json string 
    if (this.needReport) { // 判断是否需要 上报
      const startTime = Date.now();

      const handler = type => () => {
        const duration = Date.now() - startTime;
        const status = this.status;
        const statusText = this.statusText;
        const paylaod = {
          type: 'ajax',
          duration,
          requestUrl: this._url,
          status,
          statusText,
          ajaxType: type,
          body,
          response: JSON.stringify(this.response),
        }
        report && report(paylaod)
      }

      this.addEventListener('load', handler('load'), false)
      this.addEventListener('error', handler('error'), false)
      this.addEventListener('abord', handler('abord'), false)
    }

    return _send.apply(this, arguments)
  }


}