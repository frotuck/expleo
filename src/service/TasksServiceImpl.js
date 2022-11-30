'use strict';
/**
 * Delete the todo
 * Delete the todo 
 *
 * todoId Long The todo identifier
 * no response value expected for this operation
 **/
exports.deleteTodo_impl = async function(todoId,req,res) {
    return { message: 'deleteTodo - not yet implemented' };
}

/**
 * List the available tasks
 * The list of tasks can be filtered by their status. 
 *
 * status String Filters the tasks by their status (optional)
 * returns List
 **/
exports.listTodos_impl = async function(status,req,res) {
    return { message: 'listTodos - not yet implemented' };
}

/**
 * Redirect to the UI
 * Default operation to redirect to the UI index page. 
 *
 * no response value expected for this operation
 **/
exports.redirectTodos_impl = async function(req,res) {
    return { message: 'redirectTodos - not yet implemented' };
}

/**
 * Update the todo
 * Update the todo title and status 
 *
 * todoId Long The todo identifier
 * returns Todo
 **/
exports.updateTodo_impl = async function(todoId,req,res) {
    return { message: 'updateTodo - not yet implemented' };
}
