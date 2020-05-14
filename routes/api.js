const app = require('express')();
const authRouter = require('./auth');
const deptoRouter = require('./departamento');

app.use('/auth', authRouter);
app.use('/depto', deptoRouter);

module.exports = app;