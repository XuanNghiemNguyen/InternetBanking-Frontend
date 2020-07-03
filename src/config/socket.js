const setupWS = () => {
  window.WebSocket = window.WebSocket || window.MozWebSocket
  const ws = new WebSocket('ws://localhost:8082')
  ws.onopen() = function() {
    ws.send('hello boss')
  }
  ws.onmessage = function (e) {
    console.log(e)
  }
}
export default setupWS