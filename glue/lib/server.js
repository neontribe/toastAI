exports.getServerSocket = function () {
	return require('socket.io-client')(process.env.SOCKET_HOST || 'http://toastai.tech:1337');
} 