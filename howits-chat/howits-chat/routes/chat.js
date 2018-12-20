'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    console.log(req.user);
    res.render('chat', { user: req.user });
});

//router.get('/getUser', (req, res, next) => {
//    res.json(req.user)
//});

module.exports = router;
