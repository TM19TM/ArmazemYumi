const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Conectado ao MongoDB da YumiStudioArt!");
    } catch (err) {
        console.error("❌ Erro ao conectar ao MongoDB:", err.message);
        process.exit(1);
    }
};


module.exports = connectDB;