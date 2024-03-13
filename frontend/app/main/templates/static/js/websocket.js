let user = JSON.parse(localStorage.getItem(0)).user
if (user != undefined){
    var socket_url = `ws://localhost/ws/socket-server/${user.id}`
}
const socket = new WebSocket(socket_url)
