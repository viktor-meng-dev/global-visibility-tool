var socket = io();                                                     // Use the exposed io global from the socket.io-client to instantiate a socket connection to the server

socket.on('status_msg', function(msg) {
	$('#log' + msg.logId).text(msg.pydata);
	if (msg.pydata === 'Done') {socket.disconnect()};
});