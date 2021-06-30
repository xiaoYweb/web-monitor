import { sleep } from '../utils';

const URL = require('url');

let recordHash = '';
// uv 统计
export default function recordPv() {
  const { report } = this;

  window.addEventListener('hashchange', (ev) => {
    const { newURL, oldURL } = ev;
    const { hash } = location;
    if (hash === recordHash) return // 同一页面 不存在 pv + 1
    recordHash = hash;
    report && sleep(3000).then(() => { // 刷新/载入页面 优先获取 userName 再上报
      report(retPayload(oldURL, newURL)) 
    })
  })

  // 第一次 加载 pv + 1

  report && report(retPayload('', location.href)) // 实例挂载的 上报方法`
}

function retPayload(fromUrl, toUrl) {
  const payload = {
    type: 'pv',
    from: fromUrl ? retPathname(fromUrl) : '',
    to: toUrl ? retPathname(toUrl) : '',
  }
  return payload;
}

function retPathname(url) {
  const { hash } = URL.parse(url);
  if (!hash) return '/';
  const hashUrl = hash.replace(/^#/, '');
  const { pathname } = URL.parse(hashUrl);
  return pathname;
}