import userAgent from 'user-agent';

export const sleep = (timeout = 300) => {
  return new Promise(res => {
    setTimeout(() => {
      res('')
    }, timeout);
  })
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

export function selfDecodeURI(str) {
  try {
    str = decodeURI(str)
  } catch (err) {
    console.log('selDecodeURI --> err', err)
  }
  return str;
}

export function selfStringify(payload) {
  try {
    return payload ? JSON.stringify(payload) : ''
  } catch (err) {
    return payload;
  }
}

export function selfParse(payload) {
  try {
    return JSON.parse(payload)
  } catch (err) {
    return payload;
  }
}