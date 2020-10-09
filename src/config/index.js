const project = 'web-monitor';
const endpoint = 'cn-hangzhou.log.aliyuncs.com';
const logstoreName = 'monitor-logstore';

const defaultUrl = `http://${project}.${endpoint}/logstores/${logstoreName}/track`

let config = {
  reportUrl: defaultUrl,
  appName: '',

}

export function setConfig(options) {
  Object.assign(config, {
    ...options
  })
}

export function getConfig() {
  return config;
}
