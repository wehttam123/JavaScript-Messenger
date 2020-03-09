var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

let usernames = []
let userNumber = 1;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
  let username = "User" + userNumber;
  userNumber++;
  console.log(username + " has connected.")
  socket.emit('new user', [username, "Your are " + username + "."]);
  usernames.push(username);
  io.emit('update users', usernames);
  
  socket.on('chat message', function(msg){
    let date = new Date();
    let hours = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    mins = mins < 10 ? '0'+mins : mins;
    secs = secs < 10 ? '0'+secs : secs;
    let timestamp = hours + ":" + mins + ":" + secs + " " + ampm;
    io.emit('chat message', timestamp + " " + msg);
  });

  socket.on('disconnect', function(){
    usernames = usernames.filter(e => e !== username)
    console.log(username + " has disconnected.")
    io.emit('update users', usernames);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
  io.emit('chat message', "uuh");
});
