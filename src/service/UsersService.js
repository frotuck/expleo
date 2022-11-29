'use strict';
const { createTodo_impl,createUser_impl,listUsers_impl,listUsersTodos_impl } = require('./UsersServiceImpl')
/**
 * Create a todo
 *
 * userId Long The user identifier
 * returns Todo
 **/
exports.createTodo = function(userId,req,res) {
  return new Promise(function(resolve, reject) {
      resolve( createTodo_impl(userId,req,res) );
  });
}

/**
 * Create a user
 * creates a user
 *
 * body Create_user  (optional)
 * returns user
 **/
exports.createUser = function(body,req,res) {
  return new Promise(function(resolve, reject) {
      resolve( createUser_impl(body,req,res) );
  });
}

/**
 * List the available users
 * The list of users. 
 *
 * returns List
 **/
exports.listUsers = function(req,res) {
  return new Promise(function(resolve, reject) {
      resolve( listUsers_impl(req,res) );
  });
}

/**
 * List the users todos
 * The list of users todos. 
 *
 * userId Long The user identifier
 * status String Filters the tasks by their status (optional)
 * returns List
 **/
exports.listUsersTodos = function(userId,status,req,res) {
  return new Promise(function(resolve, reject) {
      resolve( listUsersTodos_impl(userId,status,req,res) );
  });
}
