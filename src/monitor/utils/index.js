export const sleep = (timeout = 300) => {
  return new Promise(res => {
    setTimeout(() => {
      res('')
    }, timeout);
  })
} 