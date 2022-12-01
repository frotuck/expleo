'use strict';
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const oas3Tools = require('oas3-tools');
const fs = require('fs');
const YAML = require('yaml');
const URL = require('url');
const { errorHandlerMiddleware } = require('./utils/error');
const router = require('./utils/router');

const {
	globalMap,
	SERVER_PORT,
	SERVER_PATH,
	TODO_API_OAS_PATH,
	TODO_API_PORT,
	TEST_MODE,
	isTestMode,
	TODO_SERVER,
} = require('./utils/globalmap');
const { connectToDatabase } = require('./helpers/utils');

function getOAS(filename) {
	const file = fs.readFileSync(filename, 'utf8');
	const oas = YAML.parse(file);
	return oas;
}

function getServerPathFromOAS(oas) {
	const server = oas.servers[0].url;
	console.log('server:', server);
	const serverURL = URL.parse(server);
	const serverPath = serverURL.pathname;
	return serverPath;
}

require('dotenv').config();

const oasPath = process.env[TODO_API_OAS_PATH] || './api/openapi.yaml';
const serverPort = process.env[TODO_API_PORT] || 8080;

process.on('uncaughtException', function (err) {
	console.log('UncaughtException...');
	console.error(err);
});

globalMap.set(SERVER_PORT, serverPort);
if (process.env[TODO_SERVER]) {
	globalMap.set(TODO_SERVER, process.env[TODO_SERVER]);
}

// swaggerRouter configuration
const options = {
	routing: {
		controllers: path.join(__dirname, './controllers'),
	},
	cors: {
		optionsSuccessStatus: 200,
		credentials: true,
		origin: ['http://localhost:3000'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE',
		exposedHeaders: true,
		preflightContinue: false,
	},
};

const oas = getOAS(oasPath);
globalMap.set(SERVER_PATH, getServerPathFromOAS(oas));

const expressAppConfig = oas3Tools.expressAppConfig(
	path.join(__dirname, 'api/openapi.yaml'),
	options
);
const openApiApp = expressAppConfig.getApp();

const app = express();

// Add headers
app.use(/.*/, cors());

// attach object router
app.use('/object', router);

for (let i = 2; i < openApiApp._router.stack.length; i++) {
	const { name } = openApiApp._router.stack[i];
    if (name === 'multipartMiddleware' || name === 'errorHandler') continue; //Upload of files is not working as expected if this middleware is registered also errorHandler.
	app._router.stack.push(openApiApp._router.stack[i]);
}

app.use(errorHandlerMiddleware);

http.createServer(app).listen(serverPort, function () {
	console.log(
		'Your server is listening on port %d (http://localhost:%d)',
		serverPort,
		serverPort
	);
	console.log(
		'Swagger-ui is available on http://localhost:%d/docs',
		serverPort
	);
});


connectToDatabase();

module.exports = app;
