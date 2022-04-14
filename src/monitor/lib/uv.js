import { sleep, getLocalStorageUid } from '../utils/index';



// uv 统计 初始化 init执行 也就是 登入 或者 刷新执行 
export default function recordUv() { // 载入/刷新页面 执行一次
  const { report } = this;
  // if (this.maskUser) return; // 若存在此 用户 uid
  const { maskUser, isFirstVist } = getLocalStorageUid();
  if (isFirstVist) {
    const payload = { 
      type: 'uv', 
      maskUser, 
      timestamp: String(Date.now()),
    }

   
    // 延迟上报 
    handleDelayExec(report, payload)
  }
}

function handleDelayExec(fn, payload, delayCount = 3) {
  delayCount--;
  if (delayCount < 0) {
    fn(payload)
    return
  }
  const { userId, userName } = window?._userInfo || {};
  if (userId && userName) {
    Object.assign(payload, {
      userId, userName
    })
    fn(payload)
    return
  }
  sleep(3000).then(() => {
    handleDelayExec(fn, payload, delayCount)
  })
}
