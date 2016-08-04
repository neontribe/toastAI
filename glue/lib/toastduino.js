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
function Toastduino(serialPort, options) {
	// call the super constructor
	EventEmitter.call(this);

	options = options || {};

	this.minSeconds = options.minSeconds || 60; // minimum seconds we can configure to toast for
	this.maxSeconds = options.maxSeconds || 300; // maximum seconds we can configure to toast for

	this.serialPort = serialPort; // the serial port to communicate over
	this.readyTimeoutId = null; // id of a function scheduled to run when toasting is finished
	this.opened = false; // whether we are connected via serial port
	this.toConfirm = null; // last angle requested, yet to be moved to
	this.toasting = false; // whether toasting is in progress
	this.toastQueue = []; // angles to move to when ready/moved to last angle
	this.handshaked = false; // whether a handshake over serial port has yet occured

	// open a serial connection
	this.serialPort.open(this._opened.bind(this));
	this.serialPort.on('data', this._data.bind(this)); // read data from it

	// TODO: catch errors & disconnect
}

// Toastduino extends EventEmitter
util.inherits(Toastduino, EventEmitter);

/*
Toasts for the number of seconds provided.
*/
Toastduino.prototype.toast = function (seconds, error) {
	// make sure seconds is in the range of min and max
	seconds = Math.max(this.minSeconds, Math.min(seconds, this.maxSeconds));

	/*
	Work out the proportion that the seconds is through the range of potential seconds...
	... then multiply it by the range of potential degrees to get the number of degrees.

	179 and an addition of 1 are used, as the range is 1-180.
	*/
	var degrees = ((seconds - this.minSeconds) / (this.maxSeconds - this.minSeconds) * 179) + 1;
	degrees = Math.round(degrees);

	// ...and queue it to be sent
	this.toastQueue.push({ 'seconds': seconds, 'degrees': degrees });

	// if we're ready, go ahead and attempt to send it
	if (this.toastQueue.length == 1 && this.opened && this.handshaked) {
		this._sendNext();
	} 
}

/*
When we have attempted to open the serial port, complain if it didn't work else attempt to send the first message.
*/
Toastduino.prototype._opened = function (error) {
	if (error) {
		this._error(error);
	}

	this.opened = true;
	this.emit('opened');
}

/*
Attempt to send the next message in the queue, if we are ready.
*/
Toastduino.prototype._sendNext = function () {
	// empty OR waiting for confirmation of previous angle
	if (this.toastQueue.length == 0 || this.toConfirm != null || this.toasting) {
		return;
	}

	var toastRequest = this.toastQueue[0];
	var message = toastRequest.degrees.toString();

	this.toConfirm = message; // wait for echo response before taking further action
	this.toasting = true; // set the status as "toasting" until further information
	this.toastQueue.splice(0, 1); // remove 1 element at index 0
	this.serialPort.write(message, this._written.bind(this)); // send

	// let us know when we can toast again, with a little added safety
	this.readyTimeoutId = setTimeout(this._ready.bind(this), (toastRequest.seconds + 30) * 1000);
}

/*
Called when the toaster is ready to toast again.

This is usually after:
* Completion of toasting (deduced from time)
* Failure of toasting (deduced from an invalid response)
*/
Toastduino.prototype._ready = function () {
	this.emit('ready');
	this.toasting = false;
	this._sendNext(); // send the next thing in the queue, if present
}

/*
Wrapper to check that our data has been written happily.
*/
Toastduino.prototype._written = function (error) {
	if (error) {
		this._error(error);
	} else {
		this.emit('written');
	}
}

/*
Handles lines of data read from the serial connection.
*/
Toastduino.prototype._data = function (buffer) {
	buffer = buffer.trim(); // without this buffer has a trailing new-line character

	this.emit('data', buffer);

	// is this an initial handshake
	if (buffer == 'READY' && !this.handshaked) {
		this.handshaked = true;
		this.emit('handshaked');
		this._sendNext(); // we're ready to send
		return;
	}

	// an echo response indicates the Toastduino is functioning correctly
	if (buffer == this.toConfirm) {
		// the Toastduino has understood our request
		this.toConfirm = null;
	} else {
		// weird response; perhaps toasting failed?
		this._error(new Error('Toasting failed, response: ' + buffer));
	}
}

/*
Called if there is any sort of error anywhere in Toastduino.
*/
Toastduino.prototype._error = function (error) {
	this.emit('error', error);

	// if there is a function about to say when toasting is finished, cancel it, toasting should /not/ be in progress
	if (this.readyTimeoutId != null) {
		// may be a stale ID, this should not matter
		clearTimeout(this.readyTimeoutId);
	}

	// we're ready for another attempt
	this._ready();
}

exports.Toastduino = Toastduino;