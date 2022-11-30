const mongoose = require('mongoose')
const { Todo, User } = require('../model/todo')

const {md5, getTodo, saveTodo} = require('./utils')

const {ServiceError} = require('../utils/error')

module.exports = {
    getTask : async function getTask(task_name) {
        const todo = await getTodo({
            model: Todo,
            key: task_name,
            keyname: 'title',
            populate: {
                path: 'createdBy',
                model: 'User',
                select: ['name','href']
            }
        })
        console.log("todo:", todo)
        if(!todo) {
            throw new ServiceError(404, `Task ${task_name} not found`)
        }

        return {
            title: todo.title,
            status: todo.status,
            due_date: todo.due_date,
            create_date: todo.create_date,
            createdBy: {
                name: todo.createdBy.name,
                href: todo.createdBy.href
            },
            href: todo.href
        }
    },

    saveTask : async function (task) {
        const todoID = md5(task.title)
        const existingTask = await Todo.findById(todoID);
        if(existingTask) {
            throw new ServiceError(409, `Task ${task.title} already exists`)
        } else {
            await saveTodo(Todo, task)
        }
    },

    getUser : async function getUser(user_name) {
        const user = await getTodo({
            model: User,
            key: user_name,
            keyname: 'name',
            populate: {
                path: 'todos',
                model: 'Todo',
                select: ['title','status','due_date','create_date','href']
            }
        })
        console.log("user:", user)

        if(!user) {
            throw new ServiceError(404, `User ${user_name} not found`)
        }

        return {
            name: user.name,
            href: user.href,
            todos: user.todos.map(todo => {
                return {
                    title: todo.title,
                    status: todo.status,
                    due_date: todo.due_date,
                    create_date: todo.create_date,
                    href: todo.href
                }
            })
        }
    },

    saveUser : async function saveUser(user) {
        const userID = md5(user.name)
        const existingUser = await User.findById(userID);
        if(existingUser) {
            throw new ServiceError(409, `User ${user.name} already exists`)
        } else {
            await saveTodo(User, user)
        }
    }
}