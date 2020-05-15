const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    nome: { type: String, required: true },
    matricula: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    optConfirmCode: { type: String, required: false },
    isConfirmed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', schema);