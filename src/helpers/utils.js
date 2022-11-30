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

function tmpFile(prefix, suffix, tmpdir) {
    prefix = (typeof prefix !== 'undefined') ? prefix : 'tmp.';
    suffix = (typeof suffix !== 'undefined') ? suffix : '';
    tmpdir = tmpdir ? tmpdir : os.tmpdir();
    return path.join(tmpdir, prefix + crypto.randomBytes(16).toString('hex') + suffix);
}

function isHex(h) {
	const re = /[0-9A-Fa-f]{6}/g;
	return re.test(h);
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
		getEnvVar('DB_DATABASE', 'expleo-todo'),
	);
	const options = {
		user: getEnvVar('DB_USER', 'expleo'),
		pass: getEnvVar('DB_PASSWORD', 'todos'),
		// useNewUrlParser: true,
		useUnifiedTopology: true,
	};

    let CAfileName;
    const CAfileKey = getEnvVar('S3_DOCDB_CAFILE_KEY');
    if( CAfileKey ) {
	const certFileBuf = await getDatabaseCACerts();
	CAfileName = tmpFile();
	console.log(CAfileName);
	await fs.promises.writeFile(CAfileName, certFileBuf)
    }
    else {
        const dbCAfile = getEnvVar('DB_CAFILE');
        if( dbCAfile ) {
	    CAfileName = dbCAfile;
        }
    }

    if( CAfileName ) {
	url += '?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';
	options.sslCA = CAfileName;
    }

	const connParams = {
		url,
		options,
	};
	console.log(connParams);
	return connParams;
}

module.exports = {
	connectToDatabase: async function () {
		const { url, options } = await getDatabaseConnectionParameters();
		const db = await mongoose.connect(url, options);
		console.log('Database connected:', url);
		if (options.sslCA) {
			await fs.promises.unlink(options.sslCA);
		}
		return db;
	},

	selectPaths: function (obj, paths) {
		const result = {};
		for (const p of paths) {
			result[p] = obj[p];
		}
		return result;
	},
    
    getTodo: async function (options) {
		// console.log('gettodo(', options, ')');
		try {
			const { model, key, keyname, populate } = options;

			const todo = isHex(key)
				? await model.findById(key).populate(populate)
				: await model.findOne({ [keyname]: key }).populate(populate);

			return todo ? todo.toObject() : null;
		} catch (e) {
			throw e;
		}
	},

    saveTodo: async function (model, todo , user_email) {
		let todoRecord = await model.findById(todo._id);
		if( todoRecord ) {
			todoRecord.overwrite({...todo , lastModifiedBy: user_email , lastModifiedAt: Date.now() });
			await todoRecord.save();
		}
		else {
			todoRecord = await model.create({...todo , createdBy: user_email , createdAt: Date.now()} );
		}
		return todoRecord.toObject();
    },

    getCompleteURL: function(req, ...parts) {
		let url;
		if (globalMap.get(CATALOG_SERVER)) {
			url = globalMap.get(CATALOG_SERVER);
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
