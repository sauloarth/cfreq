const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    mes: { type: Number, min: 0, max: 11, default: new Date().getMonth() },
    ano: { type: Number, min: 0, max: 9999, default: new Date().getFullYear() },
    funcionario: { type: Schema.Types.ObjectId, ref: 'Funcionario', required: true },
    depto: { type: Schema.Types.ObjectId, ref: 'Depto', required: true },
    status: { type: String, default: 'não entregue' },
    observacao: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Ponto', schema);