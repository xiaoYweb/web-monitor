// https://help.aliyun.com/document_detail/120218.html?spm=a2c4g.11186623.2.19.58ce5ad1ZsHDBH#reference-354467
// img http(get post) 
const project = 'web-monitor';
const endpoint = 'cn-hangzhou.log.aliyuncs.com';
const logstoreName = 'monitor-logstore';

class Http {
  constructor() {
    this.url = `http://${project}.${endpoint}/logstores/${logstoreName}/track`;
    this.xhr = new XMLHttpRequest()

  }

  report(data = {}) {
    const { xhr } = this;
    xhr.open('post', this.url, true);
    const logs = JSON.stringify({
      // __topic__: 'topic',
      // __source__: 'source',
      __logs__: [formatNumberToString(data)]
    })

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('x-log-apiversion', '0.6.0');
    xhr.setRequestHeader('x-log-bodyrawsize', logs.length);

    xhr.send(logs)
    xhr.onload = function () {

    }
    xhr.onerror = function () {

    }
  }
}


export default new Http()

function formatNumberToString(payload) {
  const res = {}
  Object.keys(payload).forEach(key => {
    const val = payload[key]
    res[key] = typeof val === 'number' ? String(val) : val;
  })
  return res;
}

/**
 *
  POST {project}.{endpoint}/logstores/{logstoreName}/track HTTP/1.1

  x-log-apiversion: 0.6.0
  x-log-bodyrawsize: 1234
  x-log-compresstype: lz4

  {
    "__topic__": "topic",
    "__source__": "source",
    "__logs__": [
      {
        "key1": "value1",
        "key2": "value2"
      },
      {
        "key1": "value1",
        "key2": "value2"
      }
    ],
    "__tags__": {
      "tag1": "value1",
      "tag2": "value2"
    }
  }
 */