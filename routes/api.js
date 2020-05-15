const app = require('express')();
const authRouter = require('./auth');
const deptoRouter = require('./departamento');
const funcionarioRouter = require('./funcionario');

app.use('/auth', authRouter);
app.use('/depto', deptoRouter);
app.use('/funcionario', funcionarioRouter);

module.exports = app;