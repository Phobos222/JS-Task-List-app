const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const asyncHandler = require('express-async-handler');
const ObjectId = mongoose.Types.ObjectId;

app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/react-todo', {
}).then(() => console.log("Connected to MongoDB")).catch(console.error);


// Models
const Todo = require('./models/Todo');

app.get('/todos', asyncHandler(async(req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}));

app.post('/todo/new', asyncHandler(async(req, res) => {
    try {
      const todo = new Todo({
        text: req.body.text,
      });
      await todo.save();
      res.json(todo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}));

app.delete('/todo/delete/:id', asyncHandler(async(req, res) => {
    const idToDelete = req.params.id;
    const objectId = new ObjectId(idToDelete);

    try {
      const result = await Todo.findByIdAndDelete(objectId);

      res.json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}));


app.get('/todo/complete/:id', asyncHandler(async(req, res) => {
  const idToUpdate = req.params.id;
  const objectId = new ObjectId(idToUpdate);

	const todo = await Todo.findById(objectId);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
}));

app.put('/todo/update/:id', asyncHandler(async(req, res) => {
  const idToUpdate = req.params.id;
  const objectId = new ObjectId(idToUpdate);

	const todo = await Todo.findById(objectId);

	todo.text = req.body.text;

	todo.save();

	res.json(todo);
}));

app.listen(3001);