const express = require('express')
const router = express.Router()
const { Todo, User } = require('../model/todo')
const {md5} = require('../helpers/utils')

const type2model = {
    'user': User,
    'task': Todo
}

function sendError (e, res) {
    res.statusCode = e.code;
    res.send({code: e.code, message: e.message}); 
}

router.get('/:type/:name', async function(req, res) {
    try {
        const id = md5(req.params.name);
        const type = type2model[req.params.type];
        const obj = await type.findById(id);
        res.send(obj);
    } catch (error) {
        sendError(error, res);
    }
})

module.exports = router
