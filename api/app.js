const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { List, Task } = require('./db/models');

// Load middleware
app.use(bodyParser.json());

// CORS Headers middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* ROUTE HANDLERS */

/*  LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // Return an array of all the lists
    List.find({}).then((lists) => {
        res.send(lists);
    });
});

/**
 * POST /lists
 * Purpose: Create a list
 */
app.post('/lists', (req, res) => {
    // Create a new list and return the new list document back to the user (which includes the id)
    // The list information (fields) will be passed in via the JSON request body
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        // The full list document is returned
        res.send(listDoc);
    });
});

/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', (req, res) => {
    // update specified list with the new values in the json
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a specified list
 */
app.delete('/lists/:id', (req, res) => {
    // delete specified list
    List.findOneAndRemove({ _id: req.params.id }, {

    }).then((removedListDoc) => {
        res.send(removedListDoc);
    });
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */
app.get('/lists/:listId/tasks', (req, res) => {
    // Return all tasks that belong to a specific list
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    });
});

/**
 * GET /lists/:listId/tasks/:taskId
 * Purpose: Get specific task by taskId
 */
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    // Return one task from list by specified taskId
    Task.findOne({ 
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    });
});

/**
 * POST /lists/:listId/tasks
 * Purpose: Create task in specified list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    // Create a new task in a list specified by listId
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    });
});

/**
 * PATCH lists/:listId/tasks/:taskId
 * Purpose: Update a task in specified list
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // update specified task with the new values in the json
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a specified task in specific list
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    // Delete specified task in specific list
    Task.findOneAndRemove({ 
        _id: req.params.taskId, 
        _listId: req.params.listId
    }, {} ).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    });
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
