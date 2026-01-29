const express = require('express');
const cors = require('cors');
const connectDB = require('./DBYUMI');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao Banco
connectDB();

// Definição do Modelo de Produto
const ProdutoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    categoria: { type: String, required: true },
    classe: { type: String, default: null },   // Ex: Bronze, Prata, Ouro
    tamanho: { type: String, default: null },  // Ex: P, M, G, PP, GG
    quantidade: { type: Number, required: true },
    valor: { type: Number, required: true },
    imagem: { type: String, required: true }
});

const Produto = mongoose.model('Produto', ProdutoSchema);

// --- ROTAS API ---

// 1. Buscar todos os produtos (usado no carregamento inicial)
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

// 2. Adicionar novo produto
app.post('/produtos', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        res.status(201).json(novoProduto);
    } catch (err) {
        res.status(400).json({ error: "Erro ao salvar produto. Verifique os campos obrigatórios." });
    }
});

// 3. Remover produto (pelo ID gerado pelo MongoDB)
app.delete('/produtos/:id', async (req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id);
        res.json({ message: "Produto removido com sucesso!" });
    } catch (err) {
        res.status(404).json({ error: "Produto não encontrado" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));