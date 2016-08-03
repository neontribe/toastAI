function getServerSocket() {
	return require('socket.io-client')(process.env.SOCKET_HOST || 'http://localhost');
} 