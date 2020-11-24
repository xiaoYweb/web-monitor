import { handleBantchReport } from '../utils';

const cache = [];

export default function enhanceAjax() {
  const { allowApiList, report, onoceReport } = this;
  
  const _XMLHttpRequest = window.XMLHttpRequest;
  const _open = _XMLHttpRequest.prototype.open;
  const _send = _XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function () { // arguments -- method, url, asunc
    const url = arguments[1];

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
        const payload = {
          type: 'ajax',
          duration,
          requestUrl: this._url,
          status,
          statusText,
          ajaxType: type,
          body,
          response: JSON.stringify(this.response),
        }
        handleBantchReport({
          report, 
          cache, 
          payload,
          maxLength: onoceReport?.ajax
        })
        // if (!report) return 
        // const len = cache.length;
        // const needReport = len >= onoceReport?.ajax;
        // if (needReport) {
        //   report([...cache])
        //   cache.length = 0;
        // } 
        // cache.push(payload)
      }

      this.addEventListener('load', handler('load'), false)
      this.addEventListener('error', handler('error'), false)
      this.addEventListener('abord', handler('abord'), false)
    }

    return _send.apply(this, arguments)
  }


}

