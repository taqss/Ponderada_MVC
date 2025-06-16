# Gerenciador de Tarefas Pessoal

Uma aplicação web completa para gerenciar tarefas pessoais, desenvolvida com Node.js, Express, PostgreSQL e seguindo o padrão MVC (Model-View-Controller).

## Funcionalidades

- **Interface Web Responsiva**: Design moderno e intuitivo
- **CRUD Completo**: Criar, listar, editar e excluir tarefas
- **Prazos de Conclusão**: Definir e visualizar datas limite
- **Descrições Detalhadas**: Adicionar notas às tarefas
- **API REST**: Endpoints para integração
- **Banco PostgreSQL**: Persistência robusta de dados
- **Responsivo**: Funciona em desktop e mobile

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Banco de Dados**: PostgreSQL
- **Template Engine**: EJS
- **Arquitetura**: MVC (Model-View-Controller)

## Requisitos

- Node.js (versão 16.x ou superior)
- PostgreSQL (versão 12.x ou superior)
- npm ou yarn

## Início Rápido

1. Instale as dependências: `npm install`
2. Configure o banco: `npm run setup`
3. Execute: `npm run dev`
4. Acesse: `http://localhost:3000`

---

## Vídeo Demonstrativo para a inicialização do projeto



## Instalação e Configuração Completa

### 1. Clonar o repositório (apenas se necessário)

**Se você ainda não tem o projeto:**
```bash
git clone https://github.com/seu-usuario/gerenciador-tarefas.git
cd gerenciador-tarefas
```

**Se o projeto já está no seu repositório local, pule para o próximo passo.**

### 2. Instalar dependências

```bash
npm install;
```

### 3. Configurar banco de dados

O projeto está configurado para usar Supabase. Execute:

```bash
npm run setup
```

Este comando irá:
- Conectar ao Supabase
- Criar a tabela de tarefas
- Inserir dados de exemplo

### 4. Inicializar banco de dados

```bash
npm run init-db
```

Este comando criará todas as tabelas necessárias e inserirá dados de exemplo.
    
## Como Usar

### 1. Iniciar o servidor

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

### 2. Acessar a aplicação

Abra seu navegador e acesse: `http://localhost:3000`

### 3. Usar a interface

- **Criar Tarefa**: Preencha o formulário no topo da página
- **Editar Tarefa**: Clique no botão "Editar" na tarefa desejada
- **Excluir Tarefa**: Clique no botão "Excluir" (com confirmação)
- **Visualizar**: Todas as tarefas são listadas automaticamente

## API Endpoints

A aplicação também oferece uma API REST completa:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/health` | Status da API |
| `GET` | `/api/tarefas` | Listar todas as tarefas |
| `POST` | `/api/tarefas` | Criar nova tarefa |
| `GET` | `/api/tarefas/:id` | Obter tarefa específica |
| `PUT` | `/api/tarefas/:id` | Atualizar tarefa |
| `PATCH` | `/api/tarefas/:id/concluir` | Marcar tarefa como concluída |
| `DELETE` | `/api/tarefas/:id` | Excluir tarefa |

---

## Documentação Completa da API

### Base URL
```
http://localhost:3000/api
```

### Health Check

#### `GET /health`
Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "UP"
}
```

### Endpoints de Tarefas

#### `GET /tarefas`
Lista todas as tarefas ordenadas por data de criação (mais recentes primeiro).

**Response:**
```json
[
  {
    "id": 1,
    "titulo": "Estudar Node.js",
    "nota": "Revisar conceitos de Express e PostgreSQL",
    "data_criacao": "2024-01-15T10:30:00.000Z",
    "prazo_conclusao": "2024-01-20T00:00:00.000Z"
  }
]
```

#### `POST /tarefas`
Cria uma nova tarefa.

**Request Body:**
```json
{
  "titulo": "Título da tarefa",
  "nota": "Descrição opcional",
  "prazo_conclusao": "2024-12-31"
}
```

**Campos:**
- `titulo` (string, obrigatório): Título da tarefa
- `nota` (string, opcional): Descrição detalhada
- `prazo_conclusao` (string, opcional): Data no formato YYYY-MM-DD

**Response (201):**
```json
{
  "id": 2,
  "titulo": "Título da tarefa",
  "nota": "Descrição opcional",
  "data_criacao": "2024-01-15T10:30:00.000Z",
  "prazo_conclusao": "2024-12-31T00:00:00.000Z"
}
```

**Error (400):**
```json
{
  "error": "O título é obrigatório"
}
```

#### `GET /tarefas/:id`
Obtém uma tarefa específica por ID.

**Parameters:**
- `id` (integer): ID da tarefa

**Response (200):**
```json
{
  "id": 1,
  "titulo": "Estudar Node.js",
  "nota": "Revisar conceitos de Express e PostgreSQL",
  "data_criacao": "2024-01-15T10:30:00.000Z",
  "prazo_conclusao": "2024-01-20T00:00:00.000Z"
}
```

**Error (404):**
```json
{
  "error": "Tarefa não encontrada"
}
```

#### `PUT /tarefas/:id`
Atualiza uma tarefa existente.

**Parameters:**
- `id` (integer): ID da tarefa

**Request Body:**
```json
{
  "titulo": "Título atualizado",
  "nota": "Nova descrição",
  "prazo_conclusao": "2024-12-31"
}
```

**Response (200):**
```json
{
  "id": 1,
  "titulo": "Título atualizado",
  "nota": "Nova descrição",
  "data_criacao": "2024-01-15T10:30:00.000Z",
  "prazo_conclusao": "2024-12-31T00:00:00.000Z"
}
```

**Error (404):**
```json
{
  "error": "Tarefa não encontrada"
}
```

#### `PATCH /tarefas/:id/concluir`
Marca uma tarefa como concluída (remove da lista).

**Parameters:**
- `id` (integer): ID da tarefa

**Response (200):**
```json
{
  "success": true,
  "message": "Tarefa marcada como concluída!",
  "tarefa": {
    "id": 1,
    "titulo": "Título da tarefa concluída"
  }
}
```

**Error (404):**
```json
{
  "error": "Tarefa não encontrada"
}
```

#### `DELETE /tarefas/:id`
Exclui uma tarefa.

**Parameters:**
- `id` (integer): ID da tarefa

**Response (200):**
```json
{
  "success": true,
  "message": "Tarefa excluída com sucesso",
  "tarefa": {
    "id": 1,
    "titulo": "Título da tarefa excluída"
  }
}
```

**Error (404):**
```json
{
  "error": "Tarefa não encontrada"
}
```

### Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno |

### Exemplos de Uso

#### cURL

**Criar tarefa:**
```bash
curl -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Estudar JavaScript",
    "nota": "Focar em ES6+ e async/await",
    "prazo_conclusao": "2024-02-01"
  }'
```

**Listar tarefas:**
```bash
curl http://localhost:3000/api/tarefas
```

**Atualizar tarefa:**
```bash
curl -X PUT http://localhost:3000/api/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Estudar JavaScript Avançado",
    "nota": "Incluir TypeScript no estudo",
    "prazo_conclusao": "2024-02-15"
  }'
```

**Excluir tarefa:**
```bash
curl -X DELETE http://localhost:3000/api/tarefas/1
```

#### JavaScript (Fetch API)

```javascript
// Criar tarefa
const novaTarefa = await fetch('/api/tarefas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    titulo: 'Nova Tarefa',
    nota: 'Descrição da tarefa',
    prazo_conclusao: '2024-12-31'
  })
});

// Listar tarefas
const tarefas = await fetch('/api/tarefas');
const listaTarefas = await tarefas.json();

// Atualizar tarefa
const tarefaAtualizada = await fetch('/api/tarefas/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    titulo: 'Tarefa Atualizada',
    nota: 'Nova descrição'
  })
});

// Excluir tarefa
const resultado = await fetch('/api/tarefas/1', {
  method: 'DELETE'
});
```

### Tratamento de Erros

Todos os endpoints retornam erros no formato JSON:

```json
{
  "error": "Mensagem de erro descritiva"
}
```

Em ambiente de desenvolvimento, detalhes adicionais podem ser incluídos:

```json
{
  "error": "Mensagem de erro",
  "details": "Detalhes técnicos do erro"
}
```

### Notas Importantes

1. **Datas**: Use formato ISO 8601 (YYYY-MM-DD) para datas
2. **Encoding**: Todas as requisições devem usar UTF-8
3. **Content-Type**: Use `application/json` para requisições POST/PUT
4. **IDs**: Todos os IDs são números inteiros auto-incrementais
5. **Timestamps**: Retornados no formato ISO 8601 com timezone UTC

---

## Estrutura do Projeto

```
gerenciador-tarefas/
├── config/
│   └── database.js          # Configuração do PostgreSQL
├── controllers/
│   └── tarefaController.js  # Lógica de negócio das tarefas
├── models/
│   └── tarefaModel.js       # Modelo de dados das tarefas
├── public/
│   ├── css/
│   │   └── style.css        # Estilos da aplicação
│   └── js/
│       └── app.js           # JavaScript do frontend
├── routes/
│   └── index.js             # Definição das rotas da API
├── scripts/
│   └── init.sql             # Script de inicialização do banco
├── tests/
│   └── example.test.js      # Testes automatizados
├── views/
│   └── index.ejs            # Template principal da aplicação
├── .env.example             # Exemplo de configuração
├── package.json             # Dependências e scripts
└── server.js                # Servidor principal
```

## Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Desenvolvimento | `npm run dev` | Inicia servidor com nodemon |
| Produção | `npm start` | Inicia servidor Node.js |
| Testes | `npm test` | Executa testes automatizados |
| Cobertura | `npm run test:coverage` | Relatório de cobertura |
| Banco | `npm run init-db` | Inicializa banco de dados |

## Características da Interface

- **Design Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Gradientes Modernos**: Visual atrativo com cores suaves
- **Feedback Visual**: Mensagens de sucesso e erro
- **Animações Suaves**: Transições e efeitos visuais
- **Acessibilidade**: Estrutura semântica e navegação por teclado

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

**Erik Taquemori Vieira**
- Projeto Individual - Módulo 2 - Inteli

---
