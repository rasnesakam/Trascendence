
var user_data = JSON.parse(localStorage.getItem(0));
console.log(user_data)
var socket_url = `ws://localhost/ws/socket-server/${user_data.user.id}`
var socket = new WebSocket(socket_url)
var socket_sent = {token: user_data.access_token, type: "new_message", message: "selam", to:user_data.user.id}
console.log(socket_sent);
socket.onopen = () => socket.send(JSON.stringify(socket_sent)) 
socket.onmessage = (data) => console.log(data)
