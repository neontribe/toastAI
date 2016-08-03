var toastduinoLib = require('./lib/toastduino');
var Toastduino = toastduinoLib.Toastduino;

toastduinoLib.findArduino(function (error, arduino) {
	if (error) {
		console.log('An error occurred: ' + error);
		return;
	}

	var toastduino = new Toastduino(arduino);

	toastduino.on('error', function (error) {
		console.log(error);
	});

	var i = 1;
	setInterval(function () {
		toastduino.setAngle(i);
		i += 40;
		i = i % 180;
	}, 3000);
});