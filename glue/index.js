var SerialPort = require('serialport');

// scout for the Arduino
SerialPort.list(function (err, ports) {
	if (err) {
		console.log(err);
		return;
	}

	if (ports.length == 0) {
		console.log(new Error('No serial ports detected'));
		return;
	}

	// choose what is hopefully the Arduino
	var portInfo = ports[0];

	console.log('Found Arduino at ' + portInfo.comName);

	// make a SerialPort object from the comName from the found port
	var port = new SerialPort(portInfo.comName, { autoOpen: false });

	port.on('open', function (error) {
		if (error) {
			console.log('Couldn\'t connect to Arduino');
			console.log(error);
			return;
		}

		console.log('Connected to Arduino');

		setInterval(function () {
			var degrees = Math.floor(Math.random() * 180) + 1;
			console.log('Telling Arduino to move to ' + degrees + ' degrees');
			port.write(degrees.toString(), function (err) {
				if (err) {
					console.log('Error sending data to the Arduino');
					console.log(err);
					return;
				}

				console.log('Successfully sent data to the Arduino');
			})
		}, 5000);
	});

	port.open();
});