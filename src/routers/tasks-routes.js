const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middlewear/auth")
const router = new express.Router()


router.post('/task', authMiddleware, async (req, res) => {

    // create a new task and add the owner filed to it
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {

        await task.save()
        res.send(task)

    } catch (e) {

        res.status(400).send(e)
    }

})


router.get('/tasks', authMiddleware, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'false'
    }

    // check if there is sortBy query pram
    if (req.query.sortBy) {
        // set sort value to -1 if sortBy contains desc and -1 otherwise
        //sort[parts[0]] set whatever field to sort by that is sent in the query pram example (?sortBy=createdAt:desc)
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    console.log(sort)
    try {
        // populate(tasks)execPopulate()  will populate the virtual filed with the ref filed set to Task
        // this  pulls all the tasks  that have a matching owner filed which is the user _id
        // check user model file under virtual attributes for details on how this is achieved

        await req.user.populate({
            path: 'tasks',
            match: match,
            // passing skip and limit and sort which are mongoose options for limiting  skipping and sorting fetching results

            // limit will set a limit on how many results should mongoose return form a fetch

            // skip will set how many result should be skipped from the fetch for example if limit was 4 and skip was 2
            // we get the last two results out of 4

            // sort is an object which contains a filed which we sort by and value of -1 for descending and 1 for ascending
            // example sort:{ createdAt: -1 }

            options: {
                limit: +req.query.limit, // pares to int using shorthand +
                skip: +req.query.skip,
                sort: sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (e) {

        res.status(500).send(e)
    }

})

router.get('/tasks/:id', authMiddleware, async (req, res) => {

    try {
        const _id = req.params.id

        console.log(req.user._id)

        const task = await Task.findOne({_id, owner: req.user._id})

        if (!task) {

            return res.status(404).send()
        }
        res.send(task)

    } catch (e) {
        res.status(500).send(e)

    }

})


router.patch('/tasks/:id', authMiddleware, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'desc']

    const isValidOps = updates.every(item => {

        return allowedUpdates.includes(item)
    })

    if (!isValidOps) {

        return res.status(400).send({error: 'update not allowed!'})
    }

    try {

        // find a task with by owner id and task id
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()


        res.send(task)

    } catch (e) {


        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', authMiddleware, async (req, res) => {


    try {
        // delete a task that matches a a task with the task id passed in the prams and the owner id whcih is
        // the user id in  request.user which is set by the authMiddleware
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router