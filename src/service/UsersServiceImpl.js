'use strict';
/**
 * Create a todo
 *
 * userId Long The user identifier
 * returns Todo
 **/
exports.createTodo_impl = async function(userId,req,res) {
    return { message: 'createTodo - not yet implemented' };
}

/**
 * Create a user
 * creates a user
 *
 * body Create_user  (optional)
 * returns user
 **/
exports.createUser_impl = async function(body,req,res) {
    return { message: 'createUser - not yet implemented' };
}

/**
 * List the available users
 * The list of users. 
 *
 * returns List
 **/
exports.listUsers_impl = async function(req,res) {
    return { message: 'listUsers - not yet implemented' };
}

/**
 * List the users todos
 * The list of users todos. 
 *
 * userId Long The user identifier
 * status String Filters the tasks by their status (optional)
 * returns List
 **/
exports.listUsersTodos_impl = async function(userId,status,req,res) {
    return { message: 'listUsersTodos - not yet implemented' };
}
