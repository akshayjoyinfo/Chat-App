const path = require('path');
const http = require('http');
const express = require("express");
const socketIO = require("socket.io");


const publicPath = path.join(__dirname,"/../public");
const PORT = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket)=>{
    console.log("A New User just Connected");

    socket.emit("newMessage", {
        from: "Admin",
        text: "Welcome to the Chat Room",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit("newMessage", {
        from: "Admin",
        text: "New User Added",
        createdAt: new Date().getTime()
    });

    socket.on("createMessage",(message) =>{
        console.log("createMessage: " ,message);
        // io.emit("newMessage", {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });

        socket.broadcast.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });
    socket.on("disconnect", (socket)=>{
        console.log("user was disconnected");
    })
});



server.listen(PORT, ()=>{
    console.log(`Server is UP on ${PORT} http://localhost:${PORT}`);
})