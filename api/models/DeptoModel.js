const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    codigo: { type: String, required: true },
    descricao: { type: String, required: true },
    sigla: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    vinculacao: { type: Schema.Types.ObjectId, ref: 'Depto' }
}, { timestamps: true });

module.exports = mongoose.model('Depto', schema);