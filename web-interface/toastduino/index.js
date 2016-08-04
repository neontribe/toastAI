var io = require('socket.io')(process.env.SOCKET_PORT || 1337);

// TODO: hook and log any errors

function Toastduino(socket) {
	this.socket = socket;
	
	// we're assuming that we're ready when we start a connection
	// TODO: consider glue sending a 'ready' event on initial connection
	this.ready = true;
	this.toastingError = null;

	this.socket.on('ready', this._ready.bind(this));
	this.socket.on('error', this._error.bind(this));
}

Toastduino.STATUS_READY = 'Ready';
Toastduino.STATUS_TOASTING = 'Toasting';

Toastduino.prototype.getStatus = function () {
	if (!this.ready) {
		return Toastduino.STATUS_TOASTING;
	}

	if (this.toastingError) {
		return this.toastingError;
	}

	return Toastduino.STATUS_READY;
}

Toastduino.prototype.isReady = function () {
	return this.ready;
}

Toastduino.prototype.toast = function (seconds) {
	if (!this.isReady()) {
		throw Error('Not ready to toast');
	}

	this.ready = false;
	this.toastingError = null;
	this.socket.emit('toast', { 'seconds': seconds });
}

Toastduino.prototype.getSocket = function () {
	return this.socket;
}

Toastduino.prototype._ready = function () {
	this.ready = true;
}

Toastduino.prototype._error = function (data) {
	// store the error as the status...
	var name = data.name;
	var message = data.message;

	this.toastingError = name + ': ' + message;
}


var toastduinos = [];

io.on('connection', function (socket) {
	var toastduino = new Toastduino(socket);
	toastduinos.push(toastduino);

	toastduino.toast(240);

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

exports.getToastduinos = function () {
	return toastduinos;
}