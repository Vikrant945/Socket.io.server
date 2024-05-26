const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors');

const expressServer = app.listen(8000);

app.use('/static', express.static('static'));


app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,'./','index.html'))
  })




const io = require("socket.io")(expressServer, {
      cors: {
        // https://vikrant945.github.io
        origin: "*",
        methods: ["GET", "POST"]

      }
    });



const users={};


 io.on('connection', socket =>{
    socket.on('newuser', username =>{
        users[socket.id] = username;
       
        socket.broadcast.emit('update-joined',username+"  joined the conversation");
    })

   
 

  socket.on("send", message =>{
  
    socket.broadcast.emit('recieve', {message:message ,user:users[socket.id]});
} )



socket.on("mydraw", position =>{
  
  socket.broadcast.emit('other-draw', {x:position.x , y:position.y ,lWidth:position.lWidth ,penColor:position.penColor,user:users[socket.id]});
} )

socket.on("down", position =>{
  
  socket.broadcast.emit('ondown', {x:position.x , y:position.y});
} )

socket.on("my-start-path", message =>{
  
  socket.broadcast.emit('other-start-path', "ok start");
} )





socket.on('get-users', () => {
  socket.emit('user-list', Object.values(users));
});


socket.on("disconnect", message =>{
  socket.broadcast.emit('update-left',users[socket.id]+ "  left the conversation");
  delete users[socket.id];
} )
})




