import userAgent from 'user-agent';

export function getExtraInfo() {
  const userAgentInfo = userAgent.parse(navigator.userAgent)
  
  return {
    timestamp: String(Date.now()),
    userAgent: userAgentInfo.fullName,
    url: location.href,
    title: document.title || '',
    // userInfo
  }
}