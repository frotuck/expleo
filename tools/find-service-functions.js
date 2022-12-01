const fs = require('fs');
const path = require('path');

async function* walk (dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

function do_match(re, s, cb) {
    let match = re.exec(s);
    // console.log(match.groups);
    do {
	cb(match);
    } while((match = re.exec(s)) !== null)    
}

( async () => {
    const service_functions = [];
    const dirPath = process.argv[2];
    // const re = /(exports\.)([a-z_]*)\s=\sfunction\(([a-z_]*?\,)\)/g; //\.))\s/g;
    for await (const p of walk(dirPath)) {
	const service_code_file = fs.readFileSync(p, 'utf8');
	do_match(/exports\.(?<funcname>[a-z_]*)\s=\sfunction\((?<params>.*)\)/g, service_code_file, (match) => {
	    const { funcname, params } = match.groups;
	    // console.log(p, funcname, params)
	    console.log(funcname+'_impl('+params+')')
	    // do_match(/([a-z_]+,?)/g, params, (match2) => {
	    // 	if( match2) {
	    // 	    console.log(match2[0]);
	    // 	}
	    // })
	});
    }
})()
