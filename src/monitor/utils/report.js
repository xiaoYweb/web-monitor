class Http {
  constructor() {
    this.url = '';
    this.xhr = new XMLHttpRequest()

  }

  report(data = {}) {
    const {xhr} =  this;
    xhr.open('post',this.url, true);
    const payload = JSON.stringify(data)
    xhr.setRequestHeader('content-type','application/json');
    
    xhr.send(payload)
    xhr.onload = function() {

    }
    xhr.onerror = function() {
      
    }
  }
}


export default new Http()