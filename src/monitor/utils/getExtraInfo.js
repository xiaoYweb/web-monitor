import userAgent from 'user-agent';
import { getConfig } from '../../config';

export function getExtraInfo() {
  const userAgentInfo = userAgent.parse(navigator.userAgent)
  const { appName } = getConfig()
  return {
    timestamp: String(Date.now()),
    userAgent: userAgentInfo.fullName,
    url: location.href,
    title: document.title || '',
    appName,
    // userInfo
  }
}