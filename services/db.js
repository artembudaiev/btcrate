const fs = require('fs');

//add user to storage
function addUser(email, hash) {
    let users = require('../db.json');
    users[email]=hash;
    fs.writeFileSync('db.json', JSON.stringify(users),function (err){
        console.log(err.message);
    });
}

//get user from storage
function getUser(email) {
    let users = require('../db.json');
    if(users[email]===undefined) return null;
    else return {email:email,hash:users[email]};
}

module.exports = {addUser, getUser};