import userAgent from 'user-agent';

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
  cache.push({
    ...payload,
    ...getExtraInfo(),
  })
  const len = cache.length;
  const needReport = len >= maxLength;
  if (needReport) {
    report([...cache])
    cache.length = 0;
  }
}



export function getExtraInfo() {
  const userAgentInfo = userAgent.parse(navigator.userAgent)
  return {
    timestamp: String(Date.now()),
    userAgent: userAgentInfo.fullName,
    url: location.href,
    title: document.title || '',
    userInfo: window?._userInfo,
    // userName: window?._userName,
    // userId: window?._userId,
  }
}