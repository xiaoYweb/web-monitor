import webtrack from '../utils/webtrack';


export default function enhanceAjax() {
  const _XMLHttpRequest = window.XMLHttpRequest;
  const _open = _XMLHttpRequest.prototype.open;
  const _send = _XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function () { // arguments -- method, url, asunc
    console.log('arguments', arguments, this)
    if (!(arguments[1].includes('logstores') || arguments[1].includes('sockjs-node'))) { //
      this.needReport = true;
      this._url = arguments[1];
    }
    return _open.apply(this, arguments)
  }

  XMLHttpRequest.prototype.send = function (body) { // json string 
    if (this.needReport) {
      const startTime = Date.now();
      const handler = type => () => {
        const duration = Date.now() - startTime;
        const status = this.status;
        const statusText = this.statusText;
        webtrack.report({
          type: 'ajax',
          duration,
          requestUrl: this._url,
          status,
          statusText,
          ajaxType: type,
          body,
          response: JSON.stringify(this.response),
        })
      }

      this.addEventListener('load', handler('load'), false)
      this.addEventListener('error', handler('error'), false)
      this.addEventListener('abord', handler('abord'), false)
    }

    return _send.apply(this, arguments)
  }


}