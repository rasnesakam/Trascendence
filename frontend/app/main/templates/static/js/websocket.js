let credentials = JSON.parse(localStorage.getItem(0))

var socket = undefined

if (credentials != null){
    let user = credentials.user;
    if (user != undefined){
        var socket_url = `ws://localhost/ws/socket-server/${user.id}`
    }
    socket = new WebSocket(socket_url)

    // event listener for ping messages
    socket.addEventListener('message', (message) =>{
        jsonObj = JSON.parse(message.data)
        if (jsonObj.type == 'ping')
            socket.send(JSON.stringify({
                type: "pong",
                to: jsonObj.from
        }))
    })   
}
