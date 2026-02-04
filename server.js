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

app.patch('/produtos/:id/remover-um', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (produto && produto.quantidade > 0) {
            produto.quantidade -= 1;
            await produto.save();
            res.json(produto);
        } else { res.status(400).json({ message: "Quantidade inválida." }); }
    } catch (err) { res.status(500).json({ error: "Erro ao atualizar." }); }
});

app.patch('/produtos/:id/adicionar-um', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) return res.status(404).json({ error: "Não encontrado" });
        produto.quantidade += 1;
        await produto.save();
        res.json(produto);
    } catch (err) { res.status(500).json({ error: "Erro ao repor estoque." }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));