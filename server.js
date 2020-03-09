var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

let usernames = [];
let userNumber = 1;
let log = [];
let offset = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){

  let username = "User" + userNumber;
  if (usernames.find(e => e === getCookie)) {
    username = getCookie;
  }
  userNumber++;
  console.log(username + " has connected.")
  socket.emit('new user', [username, "Your are " + username + ".", log]);
  usernames.push(username);
  io.emit('update users', usernames);
  

  socket.on('chat message', function(msg){

    let date = new Date();
    let hours = date.getHours();
    let mins = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    mins = mins < 10 ? '0'+mins : mins;
    let timestamp = hours + ":" + mins;

    let logMsg = timestamp + " " + username + " " + msg;
    if (log.length >= 200) {
      log.shift();
      log.push(logMsg);
    } else {
      log.push(logMsg);
    }

    socket.broadcast.emit('chat message', [timestamp, username, msg]);
    socket.emit('bold message', [timestamp, username, msg]);
  });

  socket.on('error message', function(msg){
    socket.emit('error message', msg);
  });


  socket.on('new username', function(user, oldUser){
    console.log('new: ' + user + ' old: ' + oldUser);
    if (usernames.find(e => e === user)) {
      socket.emit('error message', user + ' is not a valid username.');
    } else {
      username = user;
      console.log(username + " has been updated.")
      socket.emit('new user', [username, "Your are " + username + "."]);
      usernames = usernames.filter(e => e !== oldUser)
      usernames.push(username);
      io.emit('update users', usernames);
    }
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

function getCookie() {
  var name = "username=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      console.log(c.substring(name.length, c.length));
      return c.substring(name.length, c.length);
    }
  }
  return "";
}