import { retRandomString } from '../utils/index'; 


// uv 统计 初始化 init执行 也就是 登入 或者 刷新执行 
export default function recordUv () {
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
  report && report({ type: 'uv', maskUser }) // 实例挂载的 上报方法`
}