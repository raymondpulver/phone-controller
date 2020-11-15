'use strict';

const path = require('path');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: path.join(__dirname, 'client', 'phone-controller-client.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      scrypt: 'scrypt-js'
    },
    extensions: ['.js', '.json'],
  }
};
