const app = require('express')();
const authRouter = require('./auth');

app.use('/auth', authRouter);

module.exports = app;