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
  const { userId, userName } = window?._userInfo || {};
  return {
    timestamp: String(Date.now()),
    ua: navigator.userAgent,
    userAgent: userAgentInfo.fullName,
    url: location.href,
    title: document.title || '',
    userId, userName,
    // userInfo: window?._userInfo,
    // userName: window?._userName,
    // userId: window?._userId,
  }
}


export function parseUrl(url) {
  const pattern = RegExp("^(?:([^/?#]+))?//(?:([^:]*)(?::?(.*))@)?(?:([^/?#:]*):?([0-9]+)?)?([^?#]*)(\\?(?:[^#]*))?(#(?:.*))?");
  const matches = url.match(pattern) || [];
  const protocol = matches[1]
  const username = matches[2]
  const password = matches[3]
  const hostname = matches[4]
  const port = matches[5]
  const pathname = matches[6]
  const search = matches[7]
  const hash = matches[8]
  const query = getUrlQuery(search)

  return { protocol, username, password, hostname, port, pathname, search, hash, query };
}

export function getUrlQuery(queryString) {
  if (!queryString) return {}
  const query = {};
  queryString.split('&').forEach((item) => {
    const [key, val] =  item.split('=')
    query[key] = val;
  });
  return query;
}