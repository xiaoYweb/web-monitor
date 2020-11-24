import { getExtraInfo } from './getExtraInfo';
import { getConfig } from '../../config'
// https://help.aliyun.com/document_detail/120218.html?spm=a2c4g.11186623.2.19.58ce5ad1ZsHDBH#reference-354467
// img http(get post) 
class WebTrack {
  constructor() {
    const { reportUrl } = getConfig()
    this.url = reportUrl;
    this.xhr = new XMLHttpRequest()
  }

  report(data = {}) {
    const payload = {
      ...getExtraInfo(),
      ...data,
    }
    console.log('WebTrack -> report -> payload', payload)
    return 
    
    const { xhr } = this;
    xhr.open('post', this.url, true);
    
    const logs = JSON.stringify({
      // __topic__: 'topic',
      // __source__: 'source',
      __logs__: [formatNumberToString(payload)]
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


export default new WebTrack()


// 阿里云 数据要求 不能为 数字类型
// 遍历对象第一层 若为 number 转化为 string 类型
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