const Todo = require('../model/Todo');
const User = require('../model/User');
const {v4: uuid} = require('uuid');

const getAllTodos = async (req, res) => {
    try {
        const user = res.locals.decodedToken.id;
        const allTodos = await Todo.find({ owner: user });
        res.status(200).json({ success: true, data: allTodos });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

const createTodo = async (req, res) => {
    try {
        const user = res.locals.decodedToken.id; // Change this line
        console.log('User:', user);
        const todoData = {
            owner: user,
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
        }
        const newTodo = await new Todo (todoData);
        const savedTodo = await newTodo.save();
        const updateUser = await User.findOneAndUpdate({ _id: user }, { $push: { todos: savedTodo._id } });
        await updateUser.save();
        res.status(200).json({ success: true, data: savedTodo });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

const updateTodo = async (req, res) => {
    try {
        const user = res.locals.decodedToken.id;
        const todoId = req.params.id;
        const updateData = req.body;

        // Add lastModified field to the update data
        updateData.lastModified = new Date();

        // If "completed": true is passed in the request, set completed to true
        // and completedDate to the current date
        if(updateData.hasOwnProperty('completed') && updateData.completed === true) {
            updateData.completed = true;
            updateData.completedDate = new Date();
        }
        
        // If "completed": false is passed in the request, remove completedDate
        if(updateData.hasOwnProperty('completed') && updateData.completed === false) {
            updateData.completed = false;
            updateData.completedDate = null;
        }

        const todo = await Todo.findById(todoId);
        if (todo.owner.toString() !== user) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const updatedTodo = await Todo.findOneAndUpdate({ _id: todoId, owner: user }, updateData, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }

        res.status(200).json({ success: true, data: updatedTodo });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const deleteTodo = async (req, res) => {
    try {
        const user = res.locals.decodedToken.id;
        const todoId = req.params.id; // assuming the ID is passed as a URL parameter

        // Verify that the to-do item belongs to the authenticated user
        const todo = await Todo.findOne({ _id: todoId, owner: user });
        if (!todo) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Delete the to-do item
        const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, owner: user });
        if (!deletedTodo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }

        res.status(200).json({ success: true, data: deletedTodo });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


module.exports = { getAllTodos, createTodo, updateTodo, deleteTodo };