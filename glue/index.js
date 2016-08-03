var toastduinoLib = require('./lib/toastduino');
var server = require('./lib/server');
var Toastduino = toastduinoLib.Toastduino;

// TODO: add proper logging
// TODO: hook connect/disconnect/reconnect events

// initialise arduino connection
toastduinoLib.findArduino(function (error, arduino) {
	if (error) {
		console.log('An error occurred: ' + error);
		return;
	}

	var toastduino = new Toastduino(arduino);

	// initialise server connection
	var serverSocket = server.getServerSocket();

	serverSocket.on('setAngle', function (data) {
		var angle = data.angle;
		toastduino.setAngle(angle);
	});

	toastduino.on('error', function (error) {
		console.log(error);
		serverSocket.emit('toastduinoError', { 'name': error.name, 'message': error.message });
	});                                      																	
});