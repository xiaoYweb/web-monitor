export const sleep = (timeout = 300) => {
  return new Promise(res => {
    setTimeout(() => {
      res('')
    }, timeout);
  })
}

// 批量上报..
export function handleBantchReport(params) {
  if (!Object.keys(params).every(key => params[key])) return
  const { report, cache, payload, maxLength } = params;
  cache.push(payload)
  const len = cache.length;
  const needReport = len >= maxLength;
  if (needReport) {
    report([...cache])
    cache.length = 0;
  }
}