const Ponto = require('../models/PontoModel');
const Funcionario = require('../models/FuncionarioModel');
const Depto = require('../models/DeptoModel');
const { body, validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');
const isAuthenticated = require('../middlewares/isAuthenticated');

exports.pontoList = [
    isAuthenticated,
    async (req, res) => {
        try {
            const ponto = await Ponto.find({})
                .populate('depto', 'descricao')
                .populate('funcionario', 'nome matricula as mat');
            return apiResponse.sucessResponseWithData(res,
                'Listagem recuperada com sucesso', ponto);
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.pontoCreate = [
    isAuthenticated,
    body('mes', 'Entrada inválida para o mês')
        .isInt({ min: 0, max: 11 }).trim().escape(),
    body('ano', 'Entrada inválida para o ano')
        .isInt({ min: 0, max: 9999 }).trim().escape()
        .custom((ano, { req }) => {
            return Ponto.findOne({
                mes: req.body.mes, ano, funcionario: req.body.funcionario,
                depto: req.body.depto, _id: { '$ne': req.params.id }
            }).then(ponto => {
                if (ponto)
                    return Promise.reject('Já existe um ponto cadastro para este funcionário no mês/ano/departamento indicado.');
            })

        }).bail(),
    body('funcionario')
        .custom(funcionario => {
            return Funcionario.findOne({ _id: funcionario, isActive: true }).then(funcionario => {
                if (!funcionario)
                    return Promise.reject('Funcionario ao qual você quer vincular o ponto não existe ou não está ativo.');
            })

        }),
    body('depto')
        .custom(deptoAtual => {
            return Depto.findOne({ _id: deptoAtual, isActive: true }).then(depto => {
                if (!depto)
                    return Promise.reject('Departamento ao qual você quer vincular o ponto não existe ou não está ativo.');
            })

        }),
    async (req, res) => {
        try {
            const errors = [...validationResult(req).errors];
            if (errors.length > 0) {
                return apiResponse
                    .validationErrorWithData(res, 'Erros de validação.', errors);
            }

            const { mes, ano, funcionario, depto, status, observacao } = req.body;
            const ponto = new Ponto({ mes, ano, funcionario, depto, status, observacao });

            const savedPonto = await ponto.save();
            return apiResponse.sucessResponseWithData(res, 'Ponto salvo.', savedPonto);
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.pontoUpdate = [
    isAuthenticated,
    body('mes', 'Entrada inválida para o mês')
        .isInt({ min: 0, max: 11 }).trim().escape(),
    body('ano', 'Entrada inválida para o ano')
        .isInt({ min: 0, max: 9999 }).trim().escape()
        .custom((ano, { req }) => {
            return Ponto.findOne({
                mes: req.body.mes, ano, funcionario: req.body.funcionario,
                depto: req.body.depto, _id: { '$ne': req.params.id }
            }).then(ponto => {
                if (ponto)
                    return Promise.reject('Já existe um ponto cadastro para este funcionário no mês/ano/departamento indicado.');
            })

        }).bail(),
    body('funcionario')
        .custom(funcionario => {
            return Funcionario.findOne({ _id: funcionario, isActive: true }).then(funcionario => {
                if (!funcionario)
                    return Promise.reject('Funcionario ao qual você quer vincular o ponto não existe ou não está ativo.');
            })

        }),
    body('depto')
        .custom(deptoAtual => {
            return Depto.findOne({ _id: deptoAtual, isActive: true }).then(depto => {
                if (!depto)
                    return Promise.reject('Departamento ao qual você quer vincular o ponto não existe ou não está ativo.');
            })

        }),
    async (req, res) => {
        try {
            const errors = [...validationResult(req).errors];
            if (errors.length > 0) {
                return apiResponse
                    .validationErrorWithData(res, 'Erros de validação.', errors);
            }
            const _id = req.params.id;
            const { mes, ano, funcionario, depto, status, observacao } = req.body;

            const ponto = await Ponto
                .findOneAndUpdate({ _id }, { mes, ano, funcionario, depto, status, observacao }, { new: true })
            if (!ponto) return apiResponse.notFoundResponse(res, 'Não foi possível atualizar as informações do ponto.');

            return apiResponse.sucessResponseWithData(res, 'Informações do ponto atualizadas com sucesso', ponto);

        } catch (error) {
            console.log('Error: ', error)
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.pontoDelete = [
    isAuthenticated,
    async (req, res) => {
        try {
            const _id = req.params.id;

            const ponto = await Ponto
                .findByIdAndDelete(_id)
            if (!ponto)
                return apiResponse.notFoundResponse(res, 'Não foi possível excluir o ponto.');

            return apiResponse.sucessResponseWithData(res, 'Ponto excluído', ponto);

        } catch (error) {
            console.log('Error: ', error)
            return apiResponse.errorResponse(res, error);
        }
    }
]