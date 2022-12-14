const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const mongoose = require('mongoose');
const {
	globalMap,
	SERVER_PORT,
	SERVER_PATH,
	TODO_SERVER,
} = require('../utils/globalmap');

async function* walk(dir) {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

function getEnvVar(envVarName, defaultValue) {
	const _envVarName = 'TODO_API_' + envVarName;
	const value = process.env[_envVarName]
		? process.env[_envVarName]
		: defaultValue;
	// console.log(_envVarName, value);
	return value;
}

async function getDatabaseConnectionParameters() {
	let url = ''.concat(
		'mongodb://',
		getEnvVar('DB_SERVER', 'localhost'),
		':27017/',
		getEnvVar('DB_DATABASE', 'admin'),
	);
	const options = {
		user: getEnvVar('DB_USER', 'admin'),
		pass: getEnvVar('DB_PASSWORD', 'admin123'),
		useUnifiedTopology: true,
	};

	const connParams = {
		url,
		options,
	};
	console.log("connParams", connParams);
	return connParams;
}

module.exports = {
	connectToDatabase: async function () {
		const { url, options } = await getDatabaseConnectionParameters();
		const db = await mongoose.connect(url, options);
		console.log('Database connected:', url)
		return db;
	},

	selectPaths: function (obj, paths) {
		const result = {};
		for (const p of paths) {
			result[p] = obj[p];
		}
		return result;
	},

    getCompleteURL: function(req, ...parts) {
		let url;
		if (globalMap.get(TODO_SERVER)) {
			url = globalMap.get(TODO_SERVER);
		} else {
			const port = globalMap.get(SERVER_PORT);
			const serverPath = globalMap.get(SERVER_PATH);
			url = req.protocol + '://' +
				req.hostname +
				( port == 80 || port == 443 ? '' : ':'+port ) +
				((serverPath == '/') ? '' : serverPath);
		}


		parts.forEach( part => {
			url += '/' + part;
		})

		return url;
    },

    md5: function(data) {
        const hash = crypto.createHash("md5").update(data).digest("hex").substr(0,24);
        return hash;
        },
    
        or(p1, p2) {
            return (x) =>  p1(x) || p2(x);
        },
        and(p1, p2) {
            return (x) =>  p1(x) && p2(x);
        },
        walk: walk
};
