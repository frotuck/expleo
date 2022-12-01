'use strict';
var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');

module.exports.createTodo = async function createTodo(req,res,next,body,userId) {
  try {
    const response = await Users.createTodo(body,userId,req,res)
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}

module.exports.createUser = async function createUser(req,res,next,body) {
  try {
    const response = await Users.createUser(body,req,res)
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}

module.exports.listUsers = async function listUsers(req,res,next,tasks) {
  try {
    const response = await Users.listUsers(tasks,req,res)
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}

module.exports.listUsersTodos = async function listUsersTodos(req,res,next,userId,status) {
  try {
    const response = await Users.listUsersTodos(userId,status,req,res)
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}
