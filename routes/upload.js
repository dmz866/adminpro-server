var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;    

    if(!req.files) {
        res.status(400).json({
            ok: false,
            error: 'Seleccione una imagen'
        });    
    }

    var archivo = req.files.imagen;
    var archivoCortado = archivo.name.split('.');
    var ext = archivoCortado[archivoCortado.length - 1];
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    
    if(extValidas.indexOf(ext) == -1) {
        return res.status(400).json({
            ok: false,
            error: 'Extension no permitida'
        });
    }

    if(tiposValidos.indexOf(tipo) == -1) {
        return res.status(400).json({
            ok: false,
            error: 'Tipo no permitido'
        });
    }

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${ext}`;
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });    
        }
        
        return subirPorTipo(tipo, id, path, res);
    });
});

function subirPorTipo(tipo, id, path, res) {
    if(tipo === 'hospitales') {
        Hospital.findByIdAndUpdate(id, { img: path }, (error, hospital) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            return res.json({
                ok: true,
                hospital
            });
        });
    }
    
    if(tipo === 'medicos') {
        Medico.findByIdAndUpdate(id, { img: path }, (error, medico) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            return res.json({
                ok: true,
                medico
            });
        });
    }

    if(tipo === 'usuarios') {
        Usuario.findByIdAndUpdate(id, { img: path }, (error, usuario) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            return res.json({
                ok: true,
                usuario
            });
        });
    }
}

module.exports = app;
