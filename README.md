## Getting started

Get the code:

    $ git clone https://github.com/frotuck/expleo.git
    $ cd expleo

#### Install required tools and runtime

- NodeJS version 17+
- npm
- Docker runtime (Docker desktop in MacOS and Windows) with docker-compose.
- mongosh (a CLI to MongoDB)
- Java 11+ runtime
- swagger-codegen-cli.jar (download from https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.34/swagger-codegen-cli-3.0.34.jar) #if its not in the tool folder ofcourse

#### Setup and run local MongoDB database

The service stores its information in a MongoDB database. Locally, the database runs in Docker from a docker-compose manifest.

    $ cd mongodb/local
    $ docker network create mongodb_network  #you only do this once
    $ docker-compose up -d

The start_mongo.sh script calls on docker-compose which starts two services as docker containers; the **mongodb database server** and **Mongo Express**, a web based UI to inspect and modify the contents of the database.

> Make sure you have mongosh (mongodb shell) installed prior to executing the step below.

Wait a while for the database to start, then execute:

    $ ./initdb.sh

which will setup the required root and admin users in the local database.

Now the mongodb database runs in your machine. It will continue running as long as its docker containers are active. The mongodb containers will resume execution when the machine comes back from either a shutdown or reboot.

#### Using Mongo Express

Enter [http://localhost:8081 ](http://localhost:8081)into your browser. When asked for username and password, enter 'admin' and 'admin123' respectively. You should now see the home page of Mongo Express, showing the initial todos in the local database instance.

### Running the Todo API

Now you're all set to run the Todo API backend locally. In your shell, just do:

    $ cd ../.. # should lead to the root of expleo directory hierarchy
    $ npm start

which will do `npm install` and then launch **nodemon** which will make sure the service backend is running continuosly, restarting it on source code file changes.

## Development

### Workflow

The development of the Todo API relies on automatic code scaffolding using the service's OAS specification as the scaffolding source. This means that when the service's OAS spec is changed, a code generation step is needed to create the code that implements the endpoints and their responses stated in the OAS.

This leads to the following development workflow:

1. Edit OAS specification
2. Generate backend code from OAS
3. Implement/test/debug services (endpoints)
4. Build and run as a local container
5. Deploy to environments
6. Goto step 1 (on OAS changes) or 3 (to debug/correct endpoint implementations)

Let's go over the some of the steps in more detail:

#### 1 - Edit OAS specification

The OAS specification is in the oas/todo-api.oas.yaml file.

In order to see a Swagger UI rendering of the OAS in real time you can start the Swagger UI locally:
$ script/swagger-ui.sh
This will start the Swagger UI backend as a Docker container. To see the interactive UI of the OAS, navigate your browser to http://localhost:8001. If you make changes to the OAS and save them, the Swagger UI will update immediately.

#### 2 - Generate backend code

When you've made additions or changes to the service's OAS, you will need to generate the code that implements the endpoints.

> **Prerequiste to generating code**
> The code is generated with the swagger-codegen-cli generator. Make sure it is availble as a JAR file in the ./tools directory. At the time of writing, you can download it from https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.34/swagger-codegen-cli-3.0.34.jar.

> You will also need Java 11+ runtime installed on your machine,

To generate a new set of code files, you run a script that calls on the the code generation of the backend server:

    $ script/generate-server.sh

This will generate code into the ./workspace directory and then copy some of the generated artifacts (controllers and services) to the ./src directory.


Also generated, but not copied to ./src/services, are stubs for the implementation of the service endpoints. These are named as the service code files, with an additional "Impl" added to th end of the code filename. For instance, for the ./service/TasksService.js (corresponding to the APIs section in the OAS) there is the corresponding service implementation code file, called ./service/TasksServiceImpl.js

When a new section in the OAS is established, you can manually copy the corresponding implementation code file to ./src/service directory. This will get you a basic implementation of the endpoints in the new section, each endpoint saying "not implemented" back to the caller.

#### 3 - Implement/test/debug services (endpoints)

You will place the implementation of each section of endpoints in their corresponding service implementation code files. This table currently applies:

| OAS Section | Implemented in        |
| ----------- | --------------------- |
| Tasks       | `TasksServiceImpl.js` |
| Users       | `UsersServiceImpl.js` |

Typically, an endpoint implementation calls on the mongoose library to either save or get the information requested by the endpoint call.

## Executing tests

To execute tests please execute

    $ npm run test

## Finally

Hope you enjoy digging deep into my code Mr.Gayan I look forward to hearing back from you.
