const express = require('express');
const router = express.Router();
const db = require('../services/db');
const bcrypt = require('bcryptjs');
const config = require('../configs/default.json');
const jwt = require("jsonwebtoken");

/* Register user. */
router.post('/create', async function (req, res, next) {
    const {email, password} = req.body;
    let user = db.getUser(email);
    console.log(user);
    if (user)
        res.status(400).json({message: 'User ' + email + ' already exists'});
    else {
        const hash = await bcrypt.hash(password, 13);
        // save hash, not clear password
        db.addUser(email, hash);
        res.status(200).json({message: 'User ' + email + ' created'});
    }
});

/* Login user. */
router.post('/login', async function (req, res, next) {
    const {email, password} = req.body;
    console.log(email);
    let user = db.getUser(email);
    console.log(user);
    if (!user)
        return res.status(400).json({message: 'User ' + email + ' dont exists'});
    const isPasswordCorrect = await bcrypt.compare(password, user.hash);
    if (!isPasswordCorrect)
        return res.status(400).json({message: 'Wrong password'});
    // generating token, that defines the user
    let token = await jwt.sign(user.email, config.jwt.key);
    //adding token to cookies
    res.cookie('auth_token', token);
    res.status(200).json({message: 'Hello,' + email});
});

module.exports = router;
