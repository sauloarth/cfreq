const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    nome: { type: String, required: true },
    matricula: { type: String, required: true },
    deptoAtual: { type: Schema.Types.ObjectId, ref: 'Depto' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Funcionario', schema);