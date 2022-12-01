const mongoose = require ('mongoose');
const { Schema } = mongoose;

const TodoSchema = new Schema({
    title: String,
    status: String,
    due_date: Number, // epoch time
    create_date: Number, //epoch time
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    href: String
});

const userSchema = new Schema({
    name: String,
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }],
    href: String
});


module.exports ={Todo: mongoose.model('Todo', TodoSchema), User: mongoose.model('User', userSchema)};