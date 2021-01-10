const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const apiRouter = require('./routes/api')
const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());

const MONGODB_URL = process.env.MONGODB_URL;
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
    useFindAndModify: false,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS
}


mongoose.connect(MONGODB_URL, mongoOptions)
    .then(() => {
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to %s - test', MONGODB_URL); // change to test db string
        }
    })
    .catch(err => {
        console.error('Error on connecting to mongodb:', err)
    })

const db = mongoose.connection;

app.use('/api/', apiRouter);


const port = process.env.PORT || '3001';
app.listen(port, () => {
    console.log('Server running on port ', port)
})