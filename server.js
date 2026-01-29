const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./DBYUMI');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const Produto = mongoose.model('Produto', new mongoose.Schema({
    nome: { type: String, required: true },
    categoria: { type: String, required: true },
    classe: { type: String, default: null },   
    tamanho: { type: String, default: null },  
    quantidade: { type: Number, required: true },
    valor: { type: Number, required: true },
    imagem: { type: String, required: true }
}));

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (err) { res.status(500).json({ error: "Erro ao buscar." }); }
});

app.post('/produtos', async (req, res) => {
    try {
        const novo = new Produto(req.body);
        await novo.save();
        res.status(201).json(novo);
    } catch (err) { res.status(400).json({ error: "Erro ao salvar." }); }
});

app.delete('/produtos/:id', async (req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id);
        res.json({ message: "Removido!" });
    } catch (err) { res.status(404).json({ error: "Não encontrado." }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor em http://localhost:${PORT}`));