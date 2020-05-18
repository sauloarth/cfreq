const app = require('express')();
const authRouter = require('./auth');
const deptoRouter = require('./departamento');
const funcionarioRouter = require('./funcionario');
const pontoRouter = require('./ponto');

app.use('/auth', authRouter);
app.use('/depto', deptoRouter);
app.use('/funcionario', funcionarioRouter);
app.use('/ponto', pontoRouter);
app.use('/funcionario/:idFuncionario/ponto', pontoRouter);

module.exports = app;