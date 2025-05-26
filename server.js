// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); //Rotas

const app = express();
const port = 3000;

// Middlewares 
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Usando as rotas definidas
app.use('/api', routes);

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno no servidor',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

//Inicializar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
   console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});