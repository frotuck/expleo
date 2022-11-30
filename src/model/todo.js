const mongoose = require ('mongoose');
const { Schema } = mongoose;

const TodoSchema = new Schema({
    title: String,
    status: String,
    due_date: Date,
    create_date: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

const userSchema = new Schema({
    name: String,
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
});


module.exports = mongoose.model('Todo', TodoSchema);
module.exports = mongoose.model('User', userSchema);