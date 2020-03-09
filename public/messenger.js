var username = "";
var rgb = "000000";
var re = /[0-9A-Fa-f]{6}/g;

$(function () {
    var socket = io();

    $('form').submit(function(){
      let text = $('#m').val();
      if (text.includes('/')) {
        if (text.includes('/nickcolor ')) {
          if (!re.test(text.replace('/nickcolor ', ''))) {
            re.lastIndex = 0;
            socket.emit('error message', text + ' is not a valid RGB value');
          }
          else if (text.replace('/nickcolor ', '').length !== 6) {
            socket.emit('error message', text + ' is not a valid RGB value');
          } else {
            rgb = text.replace('/nickcolor ', '');
          }
        } else if (text.includes('/nick ')) {
          socket.emit('new username',text.replace('/nick ', ''), username)
          username = text.replace('/nick ', '');
        } else {
          socket.emit('error message', text + ' is not a valid command');
        }
      } else {
        socket.emit('chat message', text);
      }
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(args){
      $('#messages').append($('<li>').text(args[0] + " " + args[1] + " " + args[2]));
      window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('bold message', function(args){
      $('#messages').append($('<li>').text(args[0] + " " + args[1] + " " + args[2]).css("font-weight","Bold").css("color","#"+rgb));
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('new user', function(args){
      console.log(args[2]);
        username = args[0];
        document.cookie = "username=" + args[0];
        var i;
        for (i = 0; i < args[2].length; i++) {
          $('#messages').append($('<li>').text(args[2][i]));
        } 
        $('#messages').append($('<li>').text(args[1]));
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('update users', function(users){
      $('#users').empty();
      var i;
      for (i = 0; i < users.length; i++) {
        $('#users').append($('<li>').text(users[i]));
      } 
    });

    socket.on('error message', function(msg){
      $('#messages').append($('<li>').text(msg).css("font-weight","Bold"));
      window.scrollTo(0, document.body.scrollHeight);
    });
  });


//Resizable Window
$(document).ready(function() {
  let chat = document.querySelector(".chatWindow"),
  slider = document.querySelector(".slider");
  slider.onmousedown = function dragMouseDown(e) {
    let drag = e.clientX;
    document.onmousemove = function onMouseMove(e) {
      chat.style.width = chat.offsetWidth + e.clientX - drag + "px";
      drag = e.clientX;
    }
    document.onmouseup = () => document.onmousemove = document.onmouseup = null;
  }
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