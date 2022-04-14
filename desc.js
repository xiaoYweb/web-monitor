/**
 * 监控sdk 
 * 
 * 监控内容 
 * api接口 (重写 请求api  XMLHttpRequest 和 fetch)
 * 页面性能数据  (通过 api window?.performance?.timing)
 * js 异常 
 * 资源加载异常
 * pv uv
 * 用户行为 (click)
 * 
 */

/** pv 计算 浏览一次页面 即 times += 1
 *  项目基本基于hash变化 
 *  window.addEventListener('hashchange', () => {})
 */

/** uv 计算 
 * 初始化触发 计数  
 * 依赖 localStorage 存储 maskUser(随机字符串 及 当前时间)
 * 若 !maskUser || 当前时间 已经超过一天 则 times += 1
 */

/** js | 资源加载 异常计算 
 * window.addEventListener('error', ev => {
 *   ev.target.href || ev.target.src 
 *     ? 资源异常  
 *     : js 异常
 * })
 * 
 */

/** api 接口  XMLHttpRequest
 * 
 */

/** api 接口  fetch
 * 注意点 返回的 response 只能 使用一次 方法 (内部属性就会变化 所以 此处需要 拷贝一份 const res = response.clone() )
 */