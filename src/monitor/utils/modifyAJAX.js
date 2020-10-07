// 重写 请求方法 

export default function modifyXMLHttpRequest() {
  const UXMLHttpRequest  = window.XMLHttpRequest;
  UXMLHttpRequest.prototype.open = function(method, url, bol) {
    

  }
}