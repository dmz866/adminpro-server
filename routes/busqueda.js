var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medicos = require('../models/medico');
var Usuarios = require('../models/usuario');

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = new RegExp(req.params.busqueda, 'i');

    Promise.all([buscarHospitales(busqueda), buscarMedicos(busqueda), buscarUsuarios(busqueda)])
    .then((respuesta) => {
        return res.json({
            ok: true,
            hospitales: respuesta[0],
            medicos: respuesta[1],
            usuarios: respuesta[2]
        });
    })
    .catch((error) => {
        return res.status(400).json({
            ok: false,
            error
        });
    });
}); 

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = new RegExp(req.params.busqueda, 'i');
    var busquedaFN;
    
    switch(tabla) {
        case 'hospital':
            busquedaFN = buscarHospitales;
            break;
        case 'medico':
            busquedaFN = buscarMedicos;
            break;
        case 'usuario':
            busquedaFN = buscarUsuarios;
            break;
        default:
            busquedaFN = null;
            break;
    }

    if(!busquedaFN) {
        return res.status(400).json({
            ok: false,
            error: 'tabla incorrecta'
        });
    }

    busquedaFN(busqueda).then((medicos) => {
        return res.json({
            ok: true,
            medicos
        });
    })
    .catch((error) => {
        return res.status(400).json({
            ok: false,
            error
        });
    });
});

function buscarHospitales(busqueda) {
    return new Promise((res, rej) => {
        Hospital.find({ nombre: busqueda }, (error, hospitales) => {
            if(error) {
                rej('Error al buscar hospitales');
            }
            
            res(hospitales);
        })
        .populate('usuario', 'nombre email');
    });
}

function buscarMedicos(busqueda) {
    return new Promise((res, rej) => {
        Medicos.find({ nombre: busqueda }, (error, medicos) => {
            if(error) {
                rej('Error al buscar medicos');
            }
            
            res(medicos);
        })
        .populate('usuario', 'nombre email')
        .populate('hospital');
    });
}

function buscarUsuarios(busqueda) {
    return new Promise((res, rej) => {
        Usuarios.find({}, 'nombre email role', (error, usuarios) => {
            if(error) {
                rej('Error al buscar usuarios');
            }
            
            res(usuarios);
        }).or([{ nombre: busqueda }, { email: busqueda }]);
    });
}

module.exports = app;