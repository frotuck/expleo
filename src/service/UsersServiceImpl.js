'use strict';
const mongoose = require('mongoose');
const { Todo, User } = require('../model/todo');
const { ServiceError } = require('../utils/error');
const { getCompleteURL, md5 } = require('../helpers/utils');

/**
 * Create a todo
 *
 * userId Long The user identifier
 * returns Todo
 **/
exports.createTodo_impl = async function (body, userId, req, res) {
	try {
		const taskID = md5(body.title);
		//if the task already exists, throw error
		if (
			await Todo.findOne({})
				.where('createdBy')
				.equals(userId)
				.where('_id')
				.equals(taskID)
		) {
			throw new ServiceError(409, `Task ${body.title} already exists`);
		}
		const user = await User.find({ _id: userId });
		console.log(user);
		//get current time in epoch
		const time = new Date().getTime();
		if (!user) {
			throw new ServiceError(404, 'User not found');
		}
        if(body.status !== 'new' && body.status !== 'waiting' && body.status !== 'done'){
            throw new ServiceError(400, 'Invalid status');
        }
		const todos = await Todo.create({
			_id: taskID,
			title: body.title,
			description: body.description,
			status: body.status ? body.status : 'new',
			due_date: body.due_date,
			create_date: time,
			createdBy: mongoose.Types.ObjectId(userId),
			href: getCompleteURL(req, 'todos', taskID),
		});
		console.log('todos:', todos);
		return  todos ;
	} catch (error) {
		throw new ServiceError(400, error.message);
	}
};

/**
 * Create a user
 * creates a user
 *
 * body Create_user  (optional)
 * returns user
 **/
exports.createUser_impl = async function (body, req, res) {
	try {
		const userID = md5(body.name);
		const user = await User.create({
			_id: userID,
			name: body.name,
			href: getCompleteURL(req, 'users', userID, 'todos'),
		});
		return { user };
	} catch (error) {
		throw new ServiceError(400,error.message);
	}
};

/**
 * List the available users
 * The list of users.
 *
 * returns List
 **/
exports.listUsers_impl = async function (tasks, req, res) {
	try {
		//remove __v and _id
		const users = await User.find({}).select('-__v');
		const todos = await Todo.find({});
		//add todos to users
		users.forEach(user => {
			user.todos = todos.filter(
				todo => todo.createdBy.toString() === user._id.toString()
			);
		});
		if (tasks) {
			//remove users that don't have any todos in the list and return users with todos that have status "new" or "waiting"
			if (tasks === 'open') {
				const filteredUsers = users.filter(user => user.todos.length > 0);
				filteredUsers.forEach(user => {
					user.todos = user.todos.filter(
						todo => todo.status === 'new' || todo.status === 'waiting'
					);
                    if(user.todos.length === 0){
                        filteredUsers.splice(filteredUsers.indexOf(user),1);
                    }
				});
				return { users: filteredUsers };
			}
			//remove users that don't have any todos or have todo.status "new","waiting" in the list and return users with todos that have status "done"
			if (tasks === 'done') {
                try {
                    const filteredUsers = users.filter(user => user.todos.length > 0);
                    filteredUsers.forEach(user => {
                        user.todos = user.todos.filter(todo => todo.status === 'done');
                        if(user.todos.length === 0){
                            //remove users that don't have any todos with status "done"
                            filteredUsers.splice(filteredUsers.indexOf(user),1);
                        }
                    });
                    return { users: filteredUsers };
                }
                catch (error) {
                    throw new ServiceError(404,"No users found");
                }
			}


		}
		return { users };
	} catch (error) {
		throw new ServiceError(error.message);
	}
};

/**
 * List the users todos
 * The list of users todos.
 *
 * userId Long The user identifier
 * status String Filters the tasks by their status (optional)
 * returns List
 **/
exports.listUsersTodos_impl = async function (status, userId, req, res) {
	//find todos that match the userId in the request
	try {
		const todos = await Todo.find({}).where('createdBy').equals(userId);
		if (!todos) {
			throw new ServiceError(404, 'no todos associated with this user');
		}
		//if status is provided, filter the todos by status
		if (status) {
			const filteredTodos = todos.filter(todo => todo.status === status);
			return filteredTodos;
		}
		return todos;
	} catch (error) {
		throw new ServiceError(error.message);
	}
};
