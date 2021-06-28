const jwt = require('jsonwebtoken');
const config = require('../configs/default.json');
const db = require('../services/db');

// middleware authenticator
function authenticate(req, res, next) {
    const token = req.cookies.auth_token;
    console.log(token);
    if (token == null) return res.status(401).json({message: "Unauthorized"});
    jwt.verify(token, config.jwt.key, (err, email) => {
        if (err) return res.status(403).json({message: "Access forbidden"});
        let user = db.getUser(email);
        if (!user) return res.status(403).json({message: "Access forbidden"});
        req.user = user;
        next();
    })
}

module.exports = {authenticate};