import userAgent from 'user-agent';
const URL = require('url');

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
    ua: navigator.userAgent,
    userAgent: userAgentInfo.fullName,
    url: location.href,
    pathname: retPathname(location.href),
    title: document.title || '',
    userId, userName,
  }
}

export function retPathname(url) {
  const { hash } = URL.parse(url);
  if (!hash) return '/';
  const hashUrl = hash.replace(/^#/, '');
  const { pathname } = URL.parse(hashUrl);
  return pathname;
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

// 生成随机字符串
export function retRandomString(len = 10) {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd + Date.now();
}

export function throttle(cb, wait = 300) {
  let prev = Date.now();
  return function () {
    let current = Date.now();
    if (current - prev > wait) {
      prev = current;
      return cb.apply(this, arguments)
    }
  }
}


const storyKey = 'xc_uid';

export function getLocalStorageUid() {
  let { maskUser, expireTime } = selfParse(localStorage.getItem(storyKey)) || {}
  const nowTimestamp = Date.now()
  // 重新 设置 条件:  第一次 登录 或者 >= 过期时间
  if (!maskUser || !expireTime || nowTimestamp >= expireTime) {
    expireTime = calcExpireTime(nowTimestamp)
    maskUser = retRandomString()
    setLocalStorageUid({ maskUser, expireTime })
    return {
      maskUser,
      expireTime,
      isFirstVist: true
    }
  }
  return { maskUser, expireTime }
}

export function setLocalStorageUid(data) {
  return localStorage.setItem(storyKey, JSON.stringify(data))
}

function calcExpireTime(timestamp = Date.now()) {
  const dis = 24 * 3600 * 1000
  const expireTime = (Math.ceil(timestamp / dis) + 1) * dis
  return expireTime
}