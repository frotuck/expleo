'use strict';
const { deleteTodo_impl,listTodos_impl,redirectTodos_impl,todo_impl,updateTodo_impl } = require('./TasksServiceImpl')
/**
 * Delete the todo
 * Delete the todo 
 *
 * todoId String The todo identifier
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
 * List the available tasks
 * Get the specific task. 
 *
 * todoId String The todo identifier
 * returns List
 **/
exports.todo = function(todoId,req,res) {
  return new Promise(function(resolve, reject) {
      resolve( todo_impl(todoId,req,res) );
  });
}

/**
 * Update the todo
 * Update the todo title and status 
 *
 * body Update_todo  (optional)
 * todoId String The todo identifier
 * returns Todo
 **/
exports.updateTodo = function(body,todoId,req,res) {
  return new Promise(function(resolve, reject) {
      resolve( updateTodo_impl(body,todoId,req,res) );
  });
}
