exports.getServerSocket = function () {
	return require('socket.io-client')(process.env.SOCKET_HOST || 'http://localhost:1337');
} 