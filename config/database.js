require('dotenv').config();

const { Pool } = require('pg');

// Configuração para Supabase
const isSupabase = process.env.DB_HOST && process.env.DB_HOST.includes('supabase.com');

const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gerenciador_tarefas',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT) || 5432,
};

// Configurações específicas para Supabase
if (isSupabase) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
  poolConfig.connectionTimeoutMillis = 15000;
  poolConfig.idleTimeoutMillis = 30000;
  poolConfig.max = 5;
} else if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolConfig);

// Testar conexão
pool.on('connect', () => {
  console.log('Conectado ao banco PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro na conexão com o banco:', err);
});

module.exports = pool;