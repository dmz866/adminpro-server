var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();


app.get('/:tipo/:img', (req, res) => {
    var tipo = req.params.tipo;
    var img = req.params.img;   
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImagen)) {
        return res.sendfile(pathImagen);
    }
    else {
        pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        return res.sendfile(pathNoImagen);
    }
});

module.exports = app;