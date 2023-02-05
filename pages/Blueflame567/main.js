let socket = new WebSocket('ws://47.224.180.33:5656');

function sendText() {
    let text = document.getElementById("textField").value
    let id = document.getElementById("idField").value
    console.log(text)
    socket.send(JSON.stringify({
        "type": "controller",
        "turtle": text,
        "id": Number(id)
    }))
}

function send(text) {
    let id = document.getElementById("idField").value
    console.log(text, id)
    socket.send(JSON.stringify({
        "type": "controller",
        "turtle": text,
        "id": Number(id)
    }))
}

function placeSusThing() {
    send('print("Hello World")')
}

socket.onmessage = function(event) {
    console.log(event.data)
}