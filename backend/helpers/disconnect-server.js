module.exports = function disconnectServer(server, disconnectDB) {
  return new Promise((resolve) => {
    server.close(() => {
      console.log('Server closed');
      disconnectDB();
      resolve();
    });
  });
};