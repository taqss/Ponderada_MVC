// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const routes = require('./routes'); //Rotas

const app = express();
const port = 3000;

// Configurar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal para a interface web
app.get('/', (req, res) => {
  res.render('index');
});

// Usando as rotas da API
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
  console.log(`Acesse: http://localhost:${port}`);
  console.log(`API: http://localhost:${port}/api/health`);
});