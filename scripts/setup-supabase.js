#!/usr/bin/env node

/**
 * Script para configurar Supabase e criar tabelas
 */

require('dotenv').config();
const { Pool } = require('pg');

async function setupSupabase() {
    console.log('Configurando Supabase...\n');
    
    // Configuração específica para Supabase
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false,
            require: true
        },
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        max: 10,
    });

    try {
        console.log('1. Testando conexão com Supabase...');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   User: ${process.env.DB_USER}`);
        console.log(`   Database: ${process.env.DB_NAME}`);
        console.log(`   Port: ${process.env.DB_PORT}`);
        
        const client = await pool.connect();
        console.log('Conexão estabelecida com sucesso!');
        
        // Teste básico
        console.log('\n2. Testando query básica...');
        const result = await client.query('SELECT NOW() as current_time');
        console.log('Query executada com sucesso!');
        console.log(`   Hora atual: ${result.rows[0].current_time}`);
        
        // Verificar se tabela existe
        console.log('\n3. Verificando tabela Tarefas...');
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'tarefas'
            );
        `);
        
        if (!tableCheck.rows[0].exists) {
            console.log('Tabela Tarefas não encontrada. Criando...');
            
            // Criar tabela
            await client.query(`
                CREATE TABLE IF NOT EXISTS Tarefas (
                    id SERIAL PRIMARY KEY,
                    titulo VARCHAR(255) NOT NULL,
                    nota TEXT,
                    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    prazo_conclusao DATE
                );
            `);
            
            console.log('Tabela Tarefas criada com sucesso!');
            
            // Inserir dados de exemplo
            console.log('\n4. Inserindo dados de exemplo...');
            await client.query(`
                INSERT INTO Tarefas (titulo, nota, prazo_conclusao) VALUES 
                ('Configurar ambiente de desenvolvimento', 'Instalar Node.js, PostgreSQL e configurar o projeto', CURRENT_DATE + INTERVAL '3 days'),
                ('Estudar JavaScript ES6+', 'Revisar conceitos de arrow functions, destructuring e async/await', CURRENT_DATE + INTERVAL '1 week'),
                ('Fazer compras no supermercado', 'Lista: leite, pão, frutas, verduras', CURRENT_DATE + INTERVAL '2 days'),
                ('Consulta médica', 'Exame de rotina agendado para próxima semana', CURRENT_DATE + INTERVAL '1 week'),
                ('Revisar projeto MVC', 'Verificar se todas as funcionalidades estão funcionando corretamente', CURRENT_DATE + INTERVAL '5 days')
                ON CONFLICT DO NOTHING;
            `);
            
            console.log('Dados de exemplo inseridos!');
        } else {
            console.log('Tabela Tarefas já existe!');
        }
        
        // Contar registros
        const countResult = await client.query('SELECT COUNT(*) as total FROM Tarefas');
        console.log(`\nTotal de tarefas no banco: ${countResult.rows[0].total}`);
        
        // Mostrar algumas tarefas
        if (parseInt(countResult.rows[0].total) > 0) {
            console.log('\n5. Últimas tarefas cadastradas:');
            const tasksResult = await client.query(`
                SELECT id, titulo, data_criacao 
                FROM Tarefas 
                ORDER BY data_criacao DESC 
                LIMIT 3
            `);
            
            tasksResult.rows.forEach((task, index) => {
                console.log(`   ${index + 1}. [${task.id}] ${task.titulo}`);
                console.log(`      Criada em: ${new Date(task.data_criacao).toLocaleString('pt-BR')}`);
            });
        }
        
        client.release();
        
        console.log('\nConfiguração do Supabase concluída com sucesso!');
        console.log('\nPróximos passos:');
        console.log('   1. Execute: npm run dev');
        console.log('   2. Acesse: http://localhost:3000');
        console.log('   3. Teste criar uma nova tarefa!');
        
    } catch (error) {
        console.error('Erro na configuração do Supabase:');
        console.error(`   Tipo: ${error.name}`);
        console.error(`   Mensagem: ${error.message}`);
        console.error(`   Código: ${error.code || 'N/A'}`);
        
        console.log('\nPossíveis soluções:');
        console.log('   1. Verifique se as credenciais do Supabase estão corretas no .env');
        console.log('   2. Confirme se o projeto Supabase está ativo');
        console.log('   3. Verifique se a URL de conexão está correta');
        console.log('   4. Tente usar a porta 5432 ao invés de 6543');
        
        // Sugestão de configuração alternativa
        console.log('\nConfiguração alternativa para testar:');
        console.log('   DB_PORT=5432');
        console.log('   ou tente conectar via URL direta do Supabase');
        
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Executar configuração
if (require.main === module) {
    setupSupabase();
}

module.exports = setupSupabase;
