const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/index");
const goodJSON = require("./data/users/goodUser.json");
const badJSON = require("./data/users/badUser.json");
const goodTodoJSON = require("./data/tasks/goodTask.json");
const badTodoJSON = require("./data/tasks/badTask.json");
const updateTodoJson = require("./data/tasks/updateTask.json");
const { User, Todo } = require("../src/model/todo");

let should = chai.should();


chai.use(chaiHttp);

describe('Unit Tests', function () {
    const user = goodJSON;
    const badUser = badJSON;
    const todo = goodTodoJSON;
    const badTodo = badTodoJSON;
    const updateTodo = updateTodoJson;
    const request = chai.request(app).keepOpen();

    after(function () {
        //clear the database
        User.deleteMany({}, function (err) {
            console.log(err);
        });
        Todo.deleteMany({}, function (err) {
            console.log(err);
        });
    });

    describe('Test create user functionality', function () {
        it('should create a new user', function (done) {
            request
                .post('/users')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('name');
                    res.body.user.should.have.property('href');
                    res.body.user.name.should.equal(user.name);
                    done();
                });
        });
        it('should not create a new user', function (done) {
            request
                .post('/users')
                .send(badUser)
                .end(function (err, res) {
                    console.log(res.body);
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });
    describe('Test create user todo functionality', function () {
        it('should create a new todo', function (done) {
            request
                //get the user href from the previous test and create a todo for that user
                .get('/users')
                .end(function (err, res) {
                    const id = res.body.users[0]._id;
                    request
                        .post('/users/' + id + '/todos')
                        .send(todo)
                        .end(function (err, res) {
                            console.log(res.body)
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.title.should.equal(todo.title);
                            done();
                        });
        });
        it('should not create a new todo', function (done) {
            request
                .post('/users/1/todos')
                .send(badTodo)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });
});
    describe('Test list users functionality', function () {
        it('should list all users', function (done) {
            request
                .get('/users')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    done();
                });
        });
        it('should list all users with open tasks', function (done) {
            request
                .get('/users?tasks=open')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    done();
                });
        });
        it('should list all users with done tasks', function (done) {
            request
                .get('/users?tasks=done')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    done();
                });
        });
    });
    describe('Test list user todos functionality', function () {
        it('should list all todos for a user', function (done) {
            request
                .get('/users')
                .end(function (err, res) {
                    const id = res.body.users[0]._id;
                    request
                        .get('/users/' + id + '/todos')
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.equal(1);
                            done();
                        });
                });
        });
        it('should list all new todos for a user', function (done) {
            request
                .get('/users')
                .end(function (err, res) {
                    const id = res.body.users[0]._id;
                    request
                        .get('/users/' + id + '/todos?status=new')
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            done();
                        });
                });
        });
        it('should list all waiting todos for a user', function (done) {
            request
                .get('/users')
                .end(function (err, res) {
                    const id = res.body.users[0]._id;
                    request
                        .get('/users/' + id + '/todos?status=waiting')
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            done();
                        });
        });
        });
        it('should list all done todos for a user', function (done) {
            request
                .get('/users')
                .end(function (err, res) {
                    const id = res.body.users[0]._id;
                    request
                        .get('/users/' + id + '/todos?status=done')
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            done();
                        });
                });
        });
    });
    describe('Test get todos', function (){
        it('should get all todos', function (done) {
            request
                .get('/todos')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
        it('should get all new todos', function (done) {
            request
                .get('/todos?status=new')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
        it('should get all waiting todos', function (done) {
            request
                .get('/todos?status=waiting')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
        it('should get all done todos', function (done) {
            request
                .get('/todos?status=done')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
    describe('Test update todo functionality', function () {
        it('should update a todo', function (done) {
            request
                .get('/todos')
                .end(function (err, res) {
                    const id = res.body[0]._id;
                    request
                        .put('/todos/' + id)
                        .send(updateTodo)
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.title.should.equal(updateTodo.title);
                            done();
                        });
                    });
                });
        }); 
    describe('Test delete todo functionality', function () {
        it('should delete a todo', function (done) {
            request
                .get('/todos')
                .end(function (err, res) {
                    const id = res.body[0]._id;
                    request
                        .delete('/todos/' + id)
                        .end(function (err, res) {
                            res.should.have.status(204);
                            done();
                        });
                });
        });
    });
});