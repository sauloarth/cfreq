const Depto = require('../models/DeptoModel');
const { body, validationResult, param } = require('express-validator');
const apiResponse = require('../utils/apiResponse');
const isAuthenticated = require('../middlewares/isAuthenticated');

exports.deptoList = [
    isAuthenticated,
    async (req, res) => {
        try {
            const deptos = await Depto.find({ isActive: true })
                .populate('vinculacao', 'descricao');
            return apiResponse.sucessResponseWithData(res,
                'Listagem recuperada com sucesso', deptos);
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.deptoCreate = [
    isAuthenticated,
    body('codigo', 'Um código do departamento é necessário')
        .isLength({ min: 1 }).trim().escape()
        .custom(codigo => {
            return Depto.findOne({ codigo }).then(depto => {
                if (depto) return Promise.reject('Já existe um departamento com este código');
            })
        }),
    body('descricao', 'Um nome para o departamento é necessário.')
        .isLength({ min: 1 }).trim().escape()
        .custom(descricao => {
            return Depto.findOne({ descricao }).then(depto => {
                if (depto) return Promise.reject('Já existe um departamento com esta descricao');
            })
        }),
    body('sigla', 'Uma sigla para o departamento é necessária.')
        .isLength({ min: 1 }).trim().escape()
        .custom(sigla => {
            return Depto.findOne({ sigla }).then(depto => {
                if (depto) return Promise.reject('Já existe um departamento com esta sigla');
            })
        }),
    body('vinculacao')
        .optional()
        .custom(vinculacao => {

            return Depto.findOne({ _id: vinculacao, isActive: true }).then(depto => {
                if (!depto)
                    return Promise.reject('Departamento ao qual você quer vincular a unidade não existe ou não está ativo');
            })

        }),
    async (req, res) => {
        try {
            const errors = [...validationResult(req).errors];
            if (errors.length > 0) {
                return apiResponse
                    .validationErrorWithData(res, 'Erros de validação.', errors);
            }

            const { codigo, descricao, sigla, vinculacao } = req.body;
            const depto = new Depto({ codigo, descricao, sigla, vinculacao });

            const savedDepto = await depto.save();
            return apiResponse.sucessResponseWithData(res, 'Departamento salvo.', savedDepto);
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.deptoUpdate = [
    isAuthenticated,
    body('codigo', 'Um código do departamento é necessário')
        .isLength({ min: 1 }).trim().escape()
        .bail()
        .custom((codigo, { req }) => {
            return Depto.findOne({ codigo, _id: { '$ne': req.params.id } }).then(depto => {
                if (depto) return Promise.reject('Já existe um departamento com este código');
            })
        }),
    body('descricao', 'Um nome para o departamento é necessário.')
        .isLength({ min: 1 }).trim().escape()
        .bail()
        .custom((descricao, { req }) => {
            return Depto.findOne({ descricao, _id: { '$ne': req.params.id } }).then(depto => {
                if (depto) return Promise.reject('Já existe um departamento com esta descricao');
            })
        }),
    body('sigla', 'Uma sigla para o departamento é necessário.')
        .isLength({ min: 1 }).trim().escape()
        .bail()
        .custom((sigla, { req }) => {
            return Depto.findOne({ descricao, _id: { '$ne': req.params.id } }).then(depto => {
                if (depto) return Promise.reject('Já existe um departamento com esta descricao');
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
            const { codigo, descricao, sigla } = req.body;

            const depto = await Depto.findOneAndUpdate({ _id }, { codigo, descricao, sigla }, { new: true })
            if (!depto) return apiResponse.notFoundResponse(res, 'Não foi possível atualizar o depto');

            return apiResponse.sucessResponseWithData(res, 'Depto atualizado com sucesso', depto);

        } catch (error) {
            console.log('Error: ', error)
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.deptoDisable = [
    isAuthenticated,
    async (req, res) => {
        try {
            const _id = req.params.id;

            const depto = await Depto.findOneAndUpdate({ _id }, { isActive: false }, { new: true })
            if (!depto)
                return apiResponse.notFoundResponse(res, 'Não foi possível desativar o depto.');

            return apiResponse.sucessResponseWithData(res, 'Depto desativado', depto);

        } catch (error) {
            console.log('Error: ', error)
            return apiResponse.errorResponse(res, error);
        }
    }
]