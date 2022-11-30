const TODO_API_OAS_PATH = "TODO_API_OAS_PATH";
const TODO_API_PORT = "TODO_API_PORT";
const TODO_SERVER = "TODO_SERVER";
const TEST_MODE = "TEST_MODE";
const SERVER_PORT="serverPort";
const SERVER_PATH="serverPath";
const TODO_WAITING= "waiting";
const TODO_NEW= "new";
const TODO_DONE= "done";
const isTestMode = () => process.env[TEST_MODE] || false;

const TODOS = [
    TODO_NEW,
    TODO_WAITING,
    TODO_DONE
]

module.exports = {
    TODO_API_OAS_PATH,
    TODO_API_PORT,
    TODO_SERVER,
    TEST_MODE,
    SERVER_PORT,
    SERVER_PATH,
    isTestMode,
    globalMap: new Map(),
    TODOS,
    TODO_WAITING,
    TODO_NEW,
    TODO_DONE
}