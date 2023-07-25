const express = require('express');
const router = express.Router();
const {checkIfEmpty} = require('../utils/checkIfEmpty');
const {jwtValidate} = require('../utils/jwtValidate');
const {getAllTodos, createTodo, updateTodo, deleteTodo} = require('../controllers/todosController');

router.get('/all-todos', jwtValidate, getAllTodos);
router.post('/create-todo', checkIfEmpty, jwtValidate, createTodo);
router.put('/edit-todo/:id', jwtValidate, updateTodo);
router.delete('/delete-todo/:id', jwtValidate, deleteTodo);

module.exports = router;
