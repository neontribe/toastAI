var SerialPort = require('serialport');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

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

		callback(null, port);
	});	
}

function Toastduino(serialPort) {
	EventEmitter.call(this);

	this.serialPort = serialPort;
	this.opened = false;
	this.toConfirm = null;
	this.messageQueue = [];

	this.serialPort.open(this._opened.bind(this));
	this.serialPort.on('data', this._data.bind(this));

	// TODO: catch errors & disconnect
}

util.inherits(Toastduino, EventEmitter);

Toastduino.prototype.setAngle = function (angle, error) {
	var message = angle.toString();

	this.messageQueue.push(message);

	if (this.messageQueue.length == 1 && this.opened) {
		this._sendNext();
	} 
}

Toastduino.prototype._opened = function (error) {
	if (error) {
		this.errorHandler(error);
	}

	this._sendNext();

	this.emit('opened');
	this.opened = true;
}

Toastduino.prototype._sendNext = function () {
	if (this.messageQueue.length == 0 || this.toConfirm != null) {
		return;
	}

	var message = this.messageQueue[0];
	this.toConfirm = message;
	this.messageQueue.splice(0, 1);
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
	buffer = buffer.trim();

	this.emit('data', buffer);

	if (buffer == this.toConfirm) {
		this.toConfirm = null;
		this._sendNext();
	} else {
		this.emit('error', new Error('Unrecognised command: ' + buffer));
	}
}

exports.Toastduino = Toastduino;