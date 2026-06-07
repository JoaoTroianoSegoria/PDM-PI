import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste pra ver se tá vivo
app.get('/', (req, res) => {
  res.json({ message: 'API do UniPortal rodando lisa! 🚀' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});