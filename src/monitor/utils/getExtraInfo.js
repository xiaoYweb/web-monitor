export function getExtraInfo() {
  return {
    timestamp: String(Date.now()),
    userAgent: navigator.userAgent,
    url: location.href,
    title: document.title || '',
    // userInfo
  }
}