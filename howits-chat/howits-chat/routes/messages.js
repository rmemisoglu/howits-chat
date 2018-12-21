'use strict';
const express = require('express');
const router = express.Router();

//lib
const Messages = require('../src/lib/Messages');


router.get('/list', (req, res, next) => {
    Messages.list('@Room:xACGaWOWM', messages => {
        res.json(messages);
    });
});

module.exports = router;
