'use strict';
var utils = require('../utils/writer.js');
var Tasks = require('../service/TasksService');

module.exports.deleteTodo = async function deleteTodo(req,res,next,todoId) {
  try {
    const response = await Tasks.deleteTodo(todoId,req,res)
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}

module.exports.listTodos = async function listTodos(req,res,next,status) {
  try {
    const response = await Tasks.listTodos(status,req,res)
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}

module.exports.redirectTodos = async function redirectTodos(req,res,next) {
  try {
    const response = await Tasks.redirectTodos(req,res)
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}

module.exports.updateTodo = async function updateTodo(req,res,next,todoId) {
  try {
    const response = await Tasks.updateTodo(todoId,req,res)
    utils.writeJson(res, response);
  }
  catch (e) {
    next(e);
  }
}
