var SerialPort = require('serialport');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/*
Checks the serial ports and returns a SerialPort object constructed from the first available port.
*/
exports.findArduino = function (callback) {
	// scout for the Arduino
	SerialPort.list(function (err, ports) {
		if (err) {
			callback(err);
			return;
		}

		if (ports.length == 0) {
			callback(new Error('No serial ports detected'));
			return;
		}

		// choose what is hopefully the Arduino
		var portInfo = ports[0];

		// make a SerialPort object from the comName from the found port
		var port = new SerialPort(portInfo.comName, { autoOpen: false, parser: SerialPort.parsers.readline('\n') });

		// "return" the port
		callback(null, port);
	});	
}

/*
The Toastduino class. This abstracts away the serial port protocol, to make it nice to work with.
*/
function Toastduino(serialPort) {
	// call the super constructor
	EventEmitter.call(this);

	this.serialPort = serialPort;
	this.opened = false;
	this.toConfirm = null; // last angle requested, yet to be moved to
	this.messageQueue = []; // angles to move to when ready/moved to last angle

	this.serialPort.open(this._opened.bind(this));
	this.serialPort.on('data', this._data.bind(this));

	// TODO: catch errors & disconnect
}

// Toastduino extends EventEmitter
util.inherits(Toastduino, EventEmitter);

/*
Set the angle of the Toastduino
*/
Toastduino.prototype.setAngle = function (angle, error) {
	// construct the message...
	var message = angle.toString();

	// ...and queue it to be sent
	this.messageQueue.push(message);

	// if we're ready, go ahead and attempt to send it
	if (this.messageQueue.length == 1 && this.opened) {
		this._sendNext();
	} 
}

/*
When we have attempted to open the serial port, complain if it didn't work else attempt to send the first message.
*/
Toastduino.prototype._opened = function (error) {
	if (error) {
		this.errorHandler(error);
	}

	this._sendNext();

	this.emit('opened');
	this.opened = true;
}

/*
Attempt to send the next message in the queue, if we are ready.
*/
Toastduino.prototype._sendNext = function () {
	// empty OR waiting for confirmation of previous angle
	if (this.messageQueue.length == 0 || this.toConfirm != null) {
		return;
	}

	var message = this.messageQueue[0];
	this.toConfirm = message;
	this.messageQueue.splice(0, 1); // remove 1 element at index 0
	this.serialPort.write(message, this._written.bind(this));
}

Toastduino.prototype._written = function (error) {
	if (error) {
		this.emit('error', error);
	} else {
		this.emit('written');
	}
}

Toastduino.prototype._data = function (buffer) {
	buffer = buffer.trim(); // without this buffer has a trailing new-line character

	this.emit('data', buffer);

	if (buffer == this.toConfirm) {
		this.toConfirm = null;

		// we have confirmation of the last angle, attempt to send the next
		this._sendNext();
	} else {
		// weird response; perhaps angle setting failed?
		this.emit('error', new Error('Angle setting failed, response: ' + buffer));
	}
}

exports.Toastduino = Toastduino;