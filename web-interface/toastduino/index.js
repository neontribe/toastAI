var io = require('socket.io')(process.env.SOCKET_PORT || 1337);

// TODO: hook and log any errors

io.on('connection', function (socket) {
	socket.on('error', function (data) {
		var name = data.name;
		var message = data.message;

		// TODO: do something sensible
	});

	var i = 1;
	setInterval(function () {
		socket.emit('setAngle', { 'angle': i })
		i += 40;
		i = i % 180;
	}, 3000);
});