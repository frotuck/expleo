'use strict';
const { deleteTodo_impl,listTodos_impl,redirectTodos_impl,updateTodo_impl } = require('./TasksServiceImpl')
/**
 * Delete the todo
 * Delete the todo 
 *
 * todoId Long The todo identifier
 * no response value expected for this operation
 **/
exports.deleteTodo = function(todoId,req,res) {
  return new Promise(function(resolve, reject) {
      resolve( deleteTodo_impl(todoId,req,res) );
  });
}

/**
 * List the available tasks
 * The list of tasks can be filtered by their status. 
 *
 * status String Filters the tasks by their status (optional)
 * returns List
 **/
exports.listTodos = function(status,req,res) {
  return new Promise(function(resolve, reject) {
      resolve( listTodos_impl(status,req,res) );
  });
}

/**
 * Redirect to the UI
 * Default operation to redirect to the UI index page. 
 *
 * no response value expected for this operation
 **/
exports.redirectTodos = function(req,res) {
  return new Promise(function(resolve, reject) {
      resolve( redirectTodos_impl(req,res) );
  });
}

/**
 * Update the todo
 * Update the todo title and status 
 *
 * todoId Long The todo identifier
 * returns Todo
 **/
exports.updateTodo = function(todoId,req,res) {
  return new Promise(function(resolve, reject) {
      resolve( updateTodo_impl(todoId,req,res) );
  });
}
