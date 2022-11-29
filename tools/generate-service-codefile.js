/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { Parser } = require('acorn');

function generateRequireStatement(params) {
  const { codeFileName, functions } = params;
  const functionNames = functions.map((f) => `${f.name}_impl`);
  return `
const { ${functionNames} } = require('./${codeFileName}Impl')`;
}

function generateFunction(funcspec) {
  return `
/*${funcspec.comment}*/
exports.${funcspec.name} = function(${funcspec.params}) {
  return new Promise(function(resolve, reject) {
      resolve( ${funcspec.name}_impl(${funcspec.params}) );
  });
}
`;
}

function generateImplFunctionStub(funcspec) {
  return `
/*${funcspec.comment}*/
exports.${funcspec.name}_impl = async function(${funcspec.params}) {
    return { message: '${funcspec.name} - not yet implemented' };
}
`;
}

function extractFunctions(tree, comments) {
  const functions = [];

  let ci = 0;
  for (b of tree.body.filter(
    (n) => n.expression.type == 'AssignmentExpression',
  )) {
    // console.log(b);
    functions.push({
      comment: comments[ci].value, // getSourceText(comments[ci].start, comments[ci].end),
      name: b.expression.left.property.name,
      params: [...b.expression.right.params.map((p) => p.name), 'req', 'res'],
    });
    ci++;
  }
  return functions;
}

function generateModifiedCodeFile(params) {
  const {
    codeFilePath, codeFileDir, codeFileName, functions,
  } = params;
  fs.renameSync(
    codeFilePath,
    path.join(codeFileDir, `${codeFileName}.js.original`),
  );

  const writeStream = fs.createWriteStream(codeFilePath);
  writeStream.write("'use strict';");
  writeStream.write(generateRequireStatement(params));
  for (f of functions) {
    writeStream.write(generateFunction(f));
  }
  writeStream.end();
}

function generateCodeImplTemplateFile(params) {
  const { codeFileDir, codeFileName, functions } = params;
  const codeFilePath = path.join(codeFileDir, `${codeFileName}Impl.js`);

  const writeStream = fs.createWriteStream(codeFilePath);
  writeStream.write("'use strict';");

  for (f of functions) {
    writeStream.write(generateImplFunctionStub(f));
  }
  writeStream.end();
}

function main() {
  const codeFilePath = process.argv[2];
  const codeFileName = path.basename(codeFilePath, '.js');
  const codeFileDir = path.dirname(codeFilePath);

  // eslint-disable-next-line camelcase
  const service_code_file = fs.readFileSync(codeFilePath, 'utf8');

  const comments = [];
  const tree = Parser.parse(service_code_file, {
    ecmaVersion: 'ES6',
    onComment: comments,
  });
  const functions = extractFunctions(tree, comments);
  const params = {
    codeFilePath,
    codeFileName,
    codeFileDir,
    functions,
    comments,
  };

  generateModifiedCodeFile(params);
  generateCodeImplTemplateFile(params);

  console.log('regenerated', codeFilePath);
}

main();
