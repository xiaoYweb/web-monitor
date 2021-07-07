# webpack 配置 
1. 入口
2. 出口 ()
3. devServer
4. html创建及清除的插件
5. babel编译

# sdk核心内容
1. 上报公有内容: userName userId maskUser(uid随机字符串) pathname url title timestamp ua userAgent
2. uv: sdk init() 执行一次 索取 sessionStorage 中 maskUser ？ 保存 maskUser : 生成 maskUser 存入 sessionStorage && sleep().then(() => report())
3. pv: sdk init() 延迟第一次上报 && 绑定 hashchange 事件 每次上报 from to ...
4. performance: 绑定 onload 时间 收集数据(window?.performance?.timing)延迟上报(此处应该是递归循环判断是否对应的字段有值然后上报)
5. jsError: init() 绑定 error事件 
6. api: init() 重写 XMLHttpRequest 和 fetch api 
7. resourceError: init() 绑定 error 事件


# sdk优化点
1. 单个上报可以修改为批量上报 (每次触发上报 推入队列 && requestAnimationFrame 有时间则将队列中的数据一起上报)
2. pv的上报目前只支持 hashchange 事件  (history模式以及传统的多页面模式 没有兼容) --> 暂时不做处理
3. 同样的上报信息 短时间内是否已经 归并 times 上报  (服务端也需做出相应修改) --> 暂时不做处理
4. 减少上报数据内容，移除不使用的字段,上报字段缩写处理 --> 暂时不做处理
5. performance数据收集存在bug 目前是延迟3s上报 保证对应的数据全部收集上报 此处部分数据字段存在空值(onload 后 递归延时判断该数据字段存在值)