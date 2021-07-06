const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {joinUser,removeUser} = require('./users');
