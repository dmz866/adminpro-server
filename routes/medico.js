var express = require('express');
var app = express();
var Medico = require('../models/medico');
var verificaToken = require('../middlewares/autenticacion').verificaToken;

app.get('/', (req, res) => {
    Medico.find({}, (error, medicos) => {
        if(error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        return res.json({
            ok: true,
            medicos
        });
    })
    .populate('usuario', 'nombre email')
    .populate('hospital', 'nombre');
});

app.post('/', verificaToken, (req, res) => {
    let newMedico = req.body;

    Medico.create(newMedico, (error, medico) => {
        if(error) {
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
});

app.put('/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let medicoActualizar = req.body;

    Medico.findByIdAndUpdate(medicoActualizar, (error, medico) => {
        if(error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if(!medico) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Medico no existe'
                }
            });
        }

        return res.json({
            ok: true,
            medico
        });
    });
});

app.delete('/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Medico.findByIdAndRemove(id, (error, medico) => {
        if(error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if(!medico) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Medico no existe'
                }
            });
        }

        return res.json({
            ok: true,
            medico
        });
    });
});

module.exports = app;
