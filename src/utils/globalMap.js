const TODO_API_OAS_PATH = "TODO_API_OAS_PATH";
const TODO_API_PORT = "TODO_API_PORT";
const TODO_SERVER = "TODO_SERVER";
const TEST_MODE = "TEST_MODE";
const SERVER_PORT="serverPort";
const SERVER_PATH="serverPath";
const isTestMode = () => process.env[TEST_MODE] || false;


module.exports = {
    TODO_API_OAS_PATH,
    TODO_API_PORT,
    TODO_SERVER,
    TEST_MODE,
    SERVER_PORT,
    SERVER_PATH,
    isTestMode,
    globalMap: new Map(),
}