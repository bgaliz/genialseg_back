require('dotenv').config();
import express from 'express'
import cors from 'cors';
import { loginController } from './src/controller/login-controller';
import { insertClientController, updateClientController, listClientController } from './src/controller/cliente-controller';

const app = express();
app.use(cors());
app.use(express.json());


app.post('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/login', loginController);
app.post('/api/cadastrar-cliente', insertClientController);
app.put('/api/editar-cliente', updateClientController);
app.get('/api/listar-clientes', listClientController);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});