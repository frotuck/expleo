/* eslint-disable */
const fs = require('fs');
const path = require('path');
// const tty = require('tty');
const { Parser } = require('acorn');

function generateRequireStatement(params) {
  const { codeFileName } = params;
  return `
var utils = require('../utils/writer.js');
var ${(codeFileName)} = require('../service/${(codeFileName)}Service');
`;
}

function generateFunction(funcspec, params) {
  const { codeFileName } = params;
  const functionParameters = [...funcspec.params.slice(3), 'req', 'res'];
  return `
module.exports.${(funcspec.name)} = async function ${(funcspec.name)}(${(funcspec.params)}) {
  try {
    const response = await ${(codeFileName)}.${(funcspec.name)}(${(functionParameters)})
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}
`;
}

function extractFunctions(tree) {
  const functions = [];

  for (n of tree.body
    .filter((n) => (n.type = 'ExpressionStatement'))
    .filter((n) => n?.expression?.type == 'AssignmentExpression')) {
    functions.push({
      name: n.expression.left.property.name,
      params: n.expression.right.params.map((p) => p.name),
    });
  }
  return functions;
}

function generateModifiedCodeFile(params) {
  const {
    codeFilePath, codeFileDir, codeFileName, functions,
  } = params;
  fs.renameSync(codeFilePath, path.join(codeFileDir, `${codeFileName}.js.original`));

  // const writeStream = process.stdout;
  const writeStream = fs.createWriteStream(codeFilePath);

  writeStream.write("'use strict';");
  writeStream.write(generateRequireStatement(params));
  for (f of functions) {
    writeStream.write(generateFunction(f, params));
  }
  writeStream.end();
}

function main() {
  const codeFilePath = process.argv[2];
  const codeFileName = path.basename(codeFilePath, '.js');
  const codeFileDir = path.dirname(codeFilePath);

  // eslint-disable-next-line camelcase
  const controller_code_file = fs.readFileSync(codeFilePath, 'utf8');

  const tree = Parser.parse(controller_code_file, {
    ecmaVersion: 'ES6',
  });

  const functions = extractFunctions(tree);
  // console.log(functions);
  const params = {
    codeFilePath,
    codeFileName,
    codeFileDir,
    functions,
  };

  generateModifiedCodeFile(params);

  console.log('regenerated', codeFilePath);
}

main();
