const UserModel = require('../models/UserModel');
const { body,
    validationResult,
    sanitizeBody } = require('express-validator');
const apiResponse = require('../utils/apiResponse');
const utilities = require('../utils/utilities');
const mailer = require('../utils/mailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const host = process.env.HOST

exports.register = [
    body('nome')
        .isLength({ min: 3 })
        .withMessage('Um nome precisa ser especificado.')
        .escape(),
    body('matricula')
        .isLength({ min: 7, max: 8 })
        .trim().withMessage('Matricula deve ter entre 7 e 8 digitos.')
        .isAlphanumeric()
        .withMessage('Matricula deve ter apenas digitos.')
        .escape(),
    body('email')
        .isLength({ min: 3 })
        .normalizeEmail().withMessage('Um email é necessário.')
        .isEmail()
        .withMessage('Entre com um email válido.')
        .escape()
        .custom(async email => {
            return UserModel.findOne({ email }).then(user => {
                if (user)
                    return Promise.reject('O email já está cadastrado para um usuário.')
            })
        }),
    body('password')
        .isLength({ min: 6 })
        .trim()
        .withMessage('O password deve conter pelo menos 6 caractéres.'),
    (req, res) => {
        try {
            const errors = [...validationResult(req).errors];

            if (errors.length > 0) {
                return apiResponse
                    .validationErrorWithData(res, 'Erros de validação.', errors);
            } else {
                const { nome, matricula, email, password } = req.body

                bcrypt.hash(password, 10, (error, hash) => {
                    const optConfirmCode = utilities.randomNumber(4);

                    const user = new UserModel(
                        { nome, matricula, email, password: hash, optConfirmCode }
                    )

                    const html = `<h2>Confirme seu email.</h2>` +
                        `<a href=${host}/confirm/${optConfirmCode}/${email}>Clique para confirmar seu e-mail</a>`

                    mailer.send(
                        'ngpapsno.freq@gmail.com',
                        email,
                        'Cfreq - Confirme seu email',
                        html,
                    )
                        .then(() => {
                            user.save((error) => {
                                if (error) return apiResponse.errorResponse(res, error);

                                const userData = { ...user }
                                return apiResponse.sucessResponseWithData(res, 'Registrado com sucesso');
                            })
                        })
                        .catch(error => {
                            return apiResponse.errorResponse(res, error);
                        })

                })
            }
        } catch (error) {
            console.error('Erro 500:', error)
            return apiResponse.errorResponse(res, error);
        }
    }

]

exports.login = [
    body('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Você precisa de um email cadastrado para se logar.')
        .escape(),
    body('password')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Coloque um password para entrar.'),

    async (req, res) => {
        try {
            const errors = [...validationResult(req).errors];

            if (errors.length > 0) {
                return apiResponse
                    .validationErrorWithData(res, 'Erros de validação.', errors);
            } else {
                const { email, password } = req.body;
                const user = await UserModel.findOne({ email })

                if (!user)
                    return apiResponse.unauthorizedResponse(res, 'Usuário ou senha incorretos.');

                bcrypt.compare(password, user.password, (error, result) => {
                    if (!result)
                        return apiResponse.unauthorizedResponse(res, 'Usuário ou senha incorretos.');

                    if (!user.isConfirmed)
                        return apiResponse.unauthorizedResponse(res, 'Seu email ainda não foi confirmado.');

                    if (!user.isActive)
                        return apiResponse.unauthorizedResponse(res, 'Seu usuário foi desativado.');

                    const { _id, nome, matricula, email } = user
                    const jwtPayload = { _id, nome, matricula, email }
                    const secret = process.env.JWT_SECRET;
                    const expiration = { expiresIn: process.env.JWT_TIMEOUT_DURATION }

                    const token = jwt.sign(jwtPayload, secret, expiration)

                    const loggedUser = { ...jwtPayload, token }

                    return apiResponse.sucessResponseWithData(res, 'Login efetuado com sucesso.', loggedUser)
                })
            }
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.confirmEmail = [
    body('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Você precisa de um email cadastrado para se logar.')
        .escape(),
    body('opt')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Mensagem sem código de validação.'),

    async (req, res) => {
        try {
            const errors = [...validationResult(req).errors];

            if (errors.length > 0) {
                return apiResponse
                    .validationErrorWithData(res, 'Erros de validação.', errors);
            } else {
                const { email, opt } = req.body;
                const user = await UserModel.findOne({ email })

                if (!user)
                    return apiResponse.unauthorizedResponse(res, 'Email não encontrado para confirmação.');

                if (user.isConfirmed)
                    return apiResponse.unauthorizedResponse(res, 'Email já foi confirmado anteriormente.');

                if (user.optConfirmCode == opt) {
                    await UserModel
                        .findOneAndUpdate({ email }, { isConfirmed: true })
                        .then(() => {
                            return apiResponse.sucessResponse(res, 'Email confirmado com sucesso.')
                        })
                        .catch(error => { return apiResponse.errorResponse(res, error) })
                } else {
                    return apiResponse.errorResponse(res, 'Código de confirmação incorreto.');
                }
            }
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
]

exports.resendConfirmOpt = [
    body('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Você precisa de um email cadastrado para se logar.')
        .escape(),

    async (req, res) => {
        try {
            const errors = [...validationResult(req).errors];

            if (errors.length > 0) {
                return apiResponse
                    .validationErrorWithData(res, 'Erros de validação.', errors);
            } else {
                const { email } = req.body;
                const user = await UserModel.findOne({ email })

                if (!user)
                    return apiResponse.unauthorizedResponse(res, 'Email não encontrado para confirmação.');

                if (user.isConfirmed)
                    return apiResponse.unauthorizedResponse(res, 'Email já foi confirmado anteriormente.');

                const optConfirmCode = utilities.randomNumber(4);
                const html = `<p>Confirme seu email. Seu novo código foi emitido</p><p>OTP:${optConfirmCode}</p>`

                UserModel.findOneAndUpdate({ email }, { optConfirmCode })
                    .then(() => {
                        mailer.send('ngpapsno.freq@gmail.com', email,
                            'Cfreq - Reenvido do email de confirmação.', html,
                        )
                        return apiResponse.sucessResponse(res, 'Código de confirmação reenviado.')
                    })
                    .catch(error => { return apiResponse.errorResponse(res, error) })
            }

        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }

]