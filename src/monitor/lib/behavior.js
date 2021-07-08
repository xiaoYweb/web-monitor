const { throttle } = require('../utils');

function behavior() {
  const { report } = this;

  const fn = throttle(function (ev) {
    const path = getXPath(ev)
    const payload = {
      path,
      type: 'behavior',
      behaviorType: ev.type || 'click',
      timestamp: String(Date.now()),
    }
    report(payload)
  }, 500)

  document.addEventListener('click', fn)
}

function getXPath(ev) {
  const target = ev.target;
  const val = target?.innerText;
  const { className, id } = target || {}
  let path = ev.path.slice(0, -2).map(item => item.nodeName).reverse().join('/').toLowerCase();
  className && (path = `${path}.${className}`);
  id && (path = `${path}#${id}`);
  if (typeof val !== 'string') return path;
  return val.length > 10 ? `${path}(...)` : `${path}(${val})`;
}

export default behavior;