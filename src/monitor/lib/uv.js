import { retRandomString, sleep } from '../utils/index';



// uv 统计 初始化 init执行 也就是 登入 或者 刷新执行 
export default function recordUv() { // 载入/刷新页面 执行一次
  const { report } = this;
  if (this.maskUser) return;
  let maskUser = sessionStorage.getItem('mask_user');
  if (maskUser) {
    this.maskUser = maskUser;
    return
  }
  maskUser = retRandomString()
  this.maskUser = maskUser;
  sessionStorage.setItem('mask_user', maskUser)
  const payload = { type: 'uv', maskUser, timestamp: String(Date.now()) }
  // report && sleep(3000).then(() => { // 刷新/载入页面 优先获取 userName 再上报
  //   report(payload) // 实例挂载的 上报方法`
  // })

  handleDelayExec(report, payload)
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

