var io = require('socket.io')(process.env.SOCKET_PORT || 1337);

/*
#######################
### USING THIS FILE ###
#######################

toastduinoLib.getToastduinos() -> list of connected and functional Toastduino objects

Toastduino.isReady() -> returns as a boolean whether the toaster is ready to toast
Toastduino.getStatus() -> return 'Ready' if the last toast was successful and it's ready, 'Toasting' if it is toasting, else an error message if the last toast failed
Toastduino.toast(seconds) -> sends a toast request for the given number of seconds, will fail if isReady() is false
*/
 
// TODO: hook and log any errors

/*
A Toastduino class wrapper for the socket protocol.
*/
function Toastduino(socket) {
	this.socket = socket;
	
	// we're assuming that we're ready when we start a connection
	// TODO: consider glue sending a 'ready' event on initial connection
	this.ready = true;
	/*redy = true;
	Object.defineProperty(this, 'ready', {
		get: function() {
			debugger;
			return redy;
		},
		set: function(v) {
			debugger;
			redy = v;
		} 
	});*/
	this.toastingError = null;

	this.socket.on('ready', this._ready.bind(this));
	this.socket.on('error', this._error.bind(this));
}

// two of the fixed statuses - the only other possibility is an error message
Toastduino.STATUS_READY = 'Ready';
Toastduino.STATUS_TOASTING = 'Toasting';

/*
Get the current status of the toaster.
*/
Toastduino.prototype.getStatus = function () {
	// ready is called upon completion or failure of toasting
	// if it has not been, we must be toasting
	if (!this.ready) {
		return Toastduino.STATUS_TOASTING;
	}

	// last toast attempt failed, with this error
	if (this.toastingError) {
		return this.toastingError;
	}

	// if neither of the previous are conditions are true, we must be ready
	return Toastduino.STATUS_READY;
}

/*
Returns whether Toastduino is ready to accept another request.
*/
Toastduino.prototype.isReady = function () {
	return this.ready;
}

/*
Toast bread for the given number of seconds.
*/
Toastduino.prototype.toast = function (seconds) {
	if (!this.isReady()) {
		throw Error('Not ready to toast');
	}
debugger;
	this.ready = false; // we're not ready to toast again until notified
	this.toastingError = null; // no error has been encountered with this request yet
	this.socket.emit('toast', { 'seconds': seconds }); // send the request
}

Toastduino.prototype.getSocket = function () {
	return this.socket;
}

/*
Called when the socket emits the 'ready' event.
*/
Toastduino.prototype._ready = function () {
	this.ready = true;
}

/*
Called when the socket emits the 'error' event.
*/
Toastduino.prototype._error = function (data) {
	// store the error as the status...
	var name = data.name;
	var message = data.message;

	this.toastingError = name + ': ' + message;
}

// a list of toastduino objects
var toastduinos = [];

// when we receive a new connection
io.on('connection', function (socket) {
	// wrap it with a Toastduino class
	var toastduino = new Toastduino(socket);
	toastduinos.push(toastduino);

	socket.on('disconnect', function () {
		var oldToastduinos = toastduinos.slice(); // clone
		for (var toastduinoIndex in oldToastduinos) {
			var toastduino = oldToastduinos[toastduinoIndex];

			if(toastduino.getSocket() == socket) {
				// equiv to toastduinos.remove(toastduino)
				toastduinos.splice(toastduinos.indexOf(toastduino), 1);
			}
		}
	})
});

/*
Get a list of connected Toastduinos.
*/
exports.getToastduinos = function () {
	return toastduinos;
}