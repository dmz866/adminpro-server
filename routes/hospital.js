var verificaToken = require('../middlewares/autenticacion').verificaToken;
var express = require('express');
var app = express();
var Hospital = require('../models/hospital');

app.get('/', (req, res) => {
    const desde = req.query.desde || 0;
    const hasta = req.query.hasta || 5;

    Hospital.find({}, (error, hospitales) => {
        if(error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        
        Hospital.count((error, total) => {
            return res.json({
                ok: true,
                total,
                hospitales
            });
        });
    })
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(hasta);
});

app.post('/', verificaToken, (req, res) => {
    let nuevoHospital = req.body;

    Hospital.create(nuevoHospital, (error, hospital) => {
        if(error) {
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
});

app.put('/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let hospitalActualizar = req.body;

    Hospital.findByIdAndUpdate(id, hospitalActualizar, (error, hospital) => {
        if(error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if(!hospital) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Hospital no existe'
                }
            });
        }

        return res.json({
            ok: true,
            hospital
        });
    });
});

app.delete('/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (error, hospital) => {
        if(error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if(!hospital) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Hospital no existe'
                }
            });
        }

        return res.json({
            ok: true,
            hospital
        });
    });
});

module.exports = app;