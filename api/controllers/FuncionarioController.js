const Funcionario = require('../models/FuncionarioModel');
const Depto = require('../models/DeptoModel');
const { body, validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');
const isAuthenticated = require('../middlewares/isAuthenticated');

exports.funcionarioList = [
    isAuthenticated,
    async (req, res) => {
        try {
            const funcionario = await Funcionario.find({
                isActive: true,
                deptoAtual: req.query.depto
            })
                .populate('deptoAtual', 'descricao');
            return apiResponse.sucessResponseWithData(res,
                'Listagem recuperada com sucesso', funcionario);
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.funcionarioCreate = [
    isAuthenticated,
    body('nome', 'Insira um nome para o funcionario')
        .isLength({ min: 3 }).trim().escape(),
    body('matricula', 'Insira uma matrícula válida, sem pontos ou traço.')
        .isLength({ min: 7, max: 8 }).trim().escape()
        .custom(matricula => {
            return Funcionario.findOne({ matricula }).then(funcionario => {
                if (funcionario) return Promise.reject('Já existe um funcionario com essa matrícula.');
            })
        }),
    body('deptoAtual')
        .custom(deptoAtual => {
            return Depto.findOne({ _id: deptoAtual, isActive: true }).then(depto => {
                if (!depto)
                    return Promise.reject('Departamento ao qual você quer vincular o servidor não existe ou não está ativo.');
            })

        }),
    async (req, res) => {
        try {
            const errors = [...validationResult(req).errors];
            if (errors.length > 0) {
                return apiResponse
                    .validationErrorWithData(res, 'Erros de validação.', errors);
            }

            const { nome, matricula, deptoAtual } = req.body;
            const funcionario = new Funcionario({ nome, matricula, deptoAtual });

            const savedFuncionario = await funcionario.save();
            return apiResponse.sucessResponseWithData(res, 'Funcionario salvo.', savedFuncionario);
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.funcionarioUpdate = [
    isAuthenticated,
    body('nome', 'Insira um nome para o funcionario')
        .isLength({ min: 3 }).trim().escape(),
    body('matricula', 'Insira uma matrícula válida, sem pontos ou traço.')
        .isLength({ min: 7, max: 8 }).trim().escape()
        .custom((matricula, { req }) => {
            return Funcionario.findOne({ matricula, _id: { '$ne': req.params.id } }).then(funcionario => {
                if (funcionario) return Promise.reject('Já existe um funcionario com essa matrícula.');
            })
        }),
    body('deptoAtual')
        .custom(deptoAtual => {
            return Depto.findOne({ _id: deptoAtual, isActive: true }).then(depto => {
                if (!depto)
                    return Promise.reject('Departamento ao qual você quer vincular o servidor não existe ou não está ativo.');
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
            const { nome, matricula, deptoAtual } = req.body;

            const funcionario = await Funcionario
                .findOneAndUpdate({ _id }, { nome, matricula, deptoAtual }, { new: true })
            if (!funcionario) return apiResponse.notFoundResponse(res, 'Não foi possível atualizar as informações do funcionário.');

            return apiResponse.sucessResponseWithData(res, 'Informações do Funcionario atualizadas com sucesso', funcionario);

        } catch (error) {
            console.log('Error: ', error)
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.funcionarioDisable = [
    isAuthenticated,
    async (req, res) => {
        try {
            const _id = req.params.id;

            const funcionario = await Funcionario
                .findOneAndUpdate({ _id }, { isActive: false }, { new: true })
            if (!funcionario)
                return apiResponse.notFoundResponse(res, 'Não foi possível desativar o funcionário.');

            return apiResponse.sucessResponseWithData(res, 'Funcionário foi desativado', funcionario);

        } catch (error) {
            console.log('Error: ', error)
            return apiResponse.errorResponse(res, error);
        }
    }
]