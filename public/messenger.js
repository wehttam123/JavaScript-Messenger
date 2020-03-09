var username = "";

$(function () {
    var socket = io();
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('new user', function(args){
        username = args[0];
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