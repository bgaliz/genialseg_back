require('dotenv').config();
import express from 'express'
import cors from 'cors';

import { loginController } from './src/controller/login-controller';
import { insertClientController, updateClientController, listClientController } from './src/controller/cliente-controller';
import { authMiddleware } from './src/middleware/middleware';

const app = express();
app.use(cors());
app.use(express.json());


app.all('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/login', loginController);
app.post('/api/cadastrar-cliente', authMiddleware, insertClientController);
app.put('/api/editar-cliente', authMiddleware, updateClientController);
app.get('/api/listar-clientes', authMiddleware, listClientController);


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});