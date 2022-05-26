const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    database:'user_authentication',
    user:'root',
    password:'Stereo@9898'
});

module.exports = connection;