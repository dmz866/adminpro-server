var express = require('express');
var app = express();
var mongoose = require('mongoose');

app.get('/', (req, res) => {
    return res.json('ok');
});

app.listen(3000, () => {
    console.log('SERVER ON');
}); 

// conexion bdd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
if(error) {
    throw error;
}

console.log('BDD ONLINE');
});