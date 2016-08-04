var toastduinoLib = require('./lib/toastduino');
var server = require('./lib/server');
var Toastduino = toastduinoLib.Toastduino;

// TODO: add proper logging
// TODO: hook connect/disconnect/reconnect events
// TODO: let the web server know when the toast request is at the front of the queue

// initialise arduino connection
toastduinoLib.findArduino(function (error, arduino) {
	if (error) {
		console.log('An error occurred: ' + error);
		return;
	}

	// wrap it in a Toastduino object
	var toastduino = new Toastduino(arduino);

	// initialise server connection
	var serverSocket = server.getServerSocket();

	// when we get a request to toast, toast
	serverSocket.on('toast', function (data) {
		var seconds = data.seconds;
		toastduino.toast(seconds);
	});

	// pass errors to the web server
	toastduino.on('error', function (error) {
		console.log(error);
		serverSocket.emit('toastduinoError', { 'name': error.name, 'message': error.message });
	});

	// let the web server know when the Toastduino is ready to toast
	toastduino.on('ready', function () {
		serverSocket.emit('ready');
	});
});