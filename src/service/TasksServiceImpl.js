'use strict';
const mongoose = require('mongoose');
const { Todo, User } = require('../model/todo');
const {ServiceError} = require('../utils/error');

/**
 * Delete the todo
 * Delete the todo 
 *
 * todoId Long The todo identifier
 * no response value expected for this operation
 **/
exports.deleteTodo_impl = async function(todoId,req,res) {
    try {
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        await todo.remove();
        return res.status(204).send();
    } catch (error) {
        return new ServiceError(400,error.message);
    }
}

/**
 * List the available tasks
 * The list of tasks can be filtered by their status. 
 *
 * status String Filters the tasks by their status (optional)
 * returns List
 **/
exports.listTodos_impl = async function(status,req,res) {
   try {
         //remove __v
         const todos = await Todo.find({}).select('-__v');
         //filter todos by status
            if (status) {
                const filteredTodos = todos.filter(todo => todo.status === status);
                return filteredTodos;
            }
         return todos;
   } catch (error) {
            throw new ServiceError(400,error.message);
   }
}

/**
 * List the available tasks
 * Get the specific task. 
 *
 * todoId String The todo identifier
 * returns List
 **/
 exports.todo_impl = async function(todoId,req,res) {
    try {
        const todo = await Todo.findById(todoId).select('-__v');
        if (!todo) {
            return new ServiceError(404,'Todo not found');
        }
        todo.createdBy = await User.findById(todo.createdBy).select('-__v, -todos');

        return  todo ;
    } catch (error) {
        return new ServiceError(400,error.message);
    }
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
exports.updateTodo_impl = async function(body,todoId,req,res) {
    try {
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return new ServiceError(404,'Todo not found');
        }
        const { title, description, status, due_date } = body;
        //only change the updated fields
        if (title) {
            todo.title = title;
        }
        if (description) {
            todo.description = description;
        }
        if (status) {
            todo.status = status;
        }
        if (due_date) {
            todo.due_date = due_date;
        }
        await todo.save();
        return  todo ;
    } catch (error) {
        return new ServiceError(400,error.message);
    }
}
