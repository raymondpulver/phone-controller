'use strict';

const http = require('http');
const chalk = require('chalk');
const moment = require('moment');

const bip39 = require('bip39');
const readline = require('readline');
const SocketIO = require('socket.io');
const shortid = require('shortid');
const defer = () => {
  const results = {};
  results.promise = new Promise((resolve, reject) => {
    results.resolve = resolve;
    results.reject = reject;
  });
  return results;
}

const renderDateString = () => chalk.yellow.bold(moment(new Date()).format('MM-DD HH:mm:ss'));

(async () => {
  const koa = new (require('koa'))();
  const httpServer = http.createServer(koa.callback())
  const server = new SocketIO.Server(httpServer);
  const clients = {};
  server.on('connection', (client) => {
    const clientId = bip39.generateMnemonic().split(/\s/g).filter(Boolean).slice(0, 2).join('-');
    clients[clientId] = client;
    console.log(renderDateString() + ']' + chalk.magenta.bold(clientId) + ' connect');
    client.on('disconnect', () => {
      delete clients[clientId];
      console.log(renderDateString() + ']' + chalk.magenta.bold(clientId) + ' disconnect');
    });
    client.on('response', (data) => {
      console.log(renderDateString() + ']' + chalk.magenta.bold(clientId + '-' + data.uuid + ':') + ' ' + (data.success ? 'success' : 'error'));
      if (!data.success) return console.log(data.response.stack);
      console.log(require('util').inspect(data.response, { colors: true, depth: 100 }));
    })
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.makePrompt = (v) => {
    rl.setPrompt(v);
    promptText = v;
  };
  let promptText = '> ';
  let selected = null;
  const targetClient = (v) => {
    selected = v;
    if (v === null) return rl.makePrompt('> ');
    rl.makePrompt(v + '> ');
  };
  targetClient(null);
  rl.on('line', (line) => {
    if (selected) {
      if (line.match(/^exit/)) {
        targetClient(null);
      } else {
        const client = clients[selected];
        if (!client) {
          console.log('');
          console.log(chalk.bold.red('client disconnected'));
          targetClient(null);
        } else {
          client.emit('command', {
            uuid: shortid(),
            cmd: line
          });
        }
      }
    } else {
      const cmd = line.split(/\s/g);
      const first = cmd[0];
      if (first === 'target') {
        const last = cmd.slice(1).join(' ').trim();
        if (clients[last]) {
          console.log(chalk.magenta.bold('targeting ') + chalk.yellow.bold(last));
          targetClient(last);
        } else {
          console.log(chalk.red.bold('client ') + chalk.red.magenta(last) + chalk.red.bold(' not connected'));
        }
      } else if (first === 'list') {
        Object.keys(clients).forEach((v) => console.log(chalk.magenta.bold(v)));
      }
    }
    rl.prompt(promptText);
  });
  httpServer.listen('8090', '0.0.0.0')
})().catch((err) => console.error(err))
