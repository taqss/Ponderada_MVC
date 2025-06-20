# Web Application Document - Projeto Individual - Módulo 2 - Inteli


## Gerenciador de Tarefas Pessoal

#### Erik Taquemori Vieira

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução (Semana 01)

&ensp;O sistema escolhido a ser desenvolvido consiste em um Gerenciador de Tarefas pessoal com o propósito de gerir, de forma mais objetiva, as tarefas diversas(trabalho, escola, tarefas domésticas) do cotidiano dos usuários. Com base nisso, ele terá em sua estrutura 4 pilares principais para a organização dos dados, sendo eles,Usuário, tarefas, Categoria e Prioridade.

---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas (Semana 01 - opcional)

*Posicione aqui sua(s) Persona(s) em forma de texto markdown com imagens, ou como imagem de template preenchido. Atualize esta seção ao longo do módulo se necessário.*

### 2.2. User Stories (Semana 01 - opcional)

*Posicione aqui a lista de User Stories levantadas para o projeto. Siga o template de User Stories e utilize a referência USXX para numeração (US01, US02, US03, ...). Indique todas as User Stories mapeadas, mesmo aquelas que não forem implementadas ao longo do projeto. Não se esqueça de explicar o INVEST de 1 User Storie prioritária.*

---

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados  (Semana 3)

<div align="center">
  <img src= "/assets/modelo-banco.png" width="100%">
  <sub>Fonte: Autoria própia (2025)</sub>
</div>


#### Representação visual do diagrama do banco de dados

```
CREATE TABLE "Usuário" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "nome" varchar,
  "idade" varchar,
  "email" varchar UNIQUE
);

CREATE TABLE "Tarefas" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "título" varchar,
  "nota" text,
  "data_de_criação" datetime,
  "prazo_de_conclusão" datetime,
  "concluído" boolean,
  "id_Usuário" int,
  "id_Categoria" int,
  "id_Prioridade" int
);

CREATE TABLE "Categoria" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "nome" varchar,
  "descrição" text,
  "id_Usuário" int
);

CREATE TABLE "Prioridade" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "nível" varchar,
  "cor" varchar
);

COMMENT ON COLUMN "Tarefas"."nota" IS 'descrição da tarefa em específico';

ALTER TABLE "Tarefas" ADD FOREIGN KEY ("id_Usuário") REFERENCES "Usuário" ("id");

ALTER TABLE "Tarefas" ADD FOREIGN KEY ("id_Categoria") REFERENCES "Categoria" ("id");

ALTER TABLE "Tarefas" ADD FOREIGN KEY ("id_Prioridade") REFERENCES "Prioridade" ("id");

ALTER TABLE "Categoria" ADD FOREIGN KEY ("id_Usuário") REFERENCES "Usuário" ("id");

```

### 3.1.1 BD e Models (Semana 5)
#### TarefaModel
Responsável por todas as operações com a tabela `Tarefas` no banco de dados PostgreSQL.

**Estrutura da tabela `Tarefas`:**
| Campo             | Tipo        | Obrigatório | Descrição                              |
|-------------------|-------------|-------------|----------------------------------------|
| id                | SERIAL      | Sim         | Chave primária auto-incrementável      |
| titulo            | VARCHAR(255)| Sim         | Título/descrição breve da tarefa       |
| nota              | TEXT        | Não         | Detalhes adicionais                    |
| data_criacao      | TIMESTAMP   | Sim         | Data/hora de criação automática        |
| prazo_conclusao   | DATE        | Não         | Data limite para conclusão             |

**Métodos principais:**

| Método            | SQL Equivalent               | Descrição                                  |
|-------------------|-----------------------------|-------------------------------------------|
| `criar()`         | `INSERT INTO Tarefas...`    | Cria nova tarefa no banco                 |
| `listar()`        | `SELECT * FROM Tarefas`     | Retorna todas as tarefas ordenadas por data |
| `buscarPorId()`   | `SELECT... WHERE id = $1`   | Busca uma tarefa específica por ID        |
| `atualizar()`     | `UPDATE Tarefas...`         | Edita os dados de uma tarefa existente    |
| `deletar()`       | `DELETE FROM Tarefas...`    | Remove permanentemente uma tarefa         |

**Exemplo de Uso:**
```javascript
const tarefa = await TarefaModel.criar(
  "Reunião com equipe", 
  "Preparar apresentação",
  "2023-12-15"
);
```

### 3.2. Arquitetura (Semana 5)

<div align="center">
  <img src= "/assets/diagrama_de_arquitetura.png" width="100%">
  <sub>Fonte: Autoria própia (2025)</sub>
</div>
  

### 3.3. Wireframes (Semana 03 - opcional)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização).*

### 3.4. Guia de estilos (Semana 05 - opcional)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05 - opcional)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

#### POST `/api/tarefas`
**Cria uma nova tarefa**

**Request:**
```http
POST /api/tarefas
Content-Type: application/json

{
  "titulo": "Estudar React",
  "nota": "Hooks useEffect",
  "prazo_conclusao": "2023-12-20"
}  
```

### 3.7 Interface e Navegação (Semana 07)

&ensp;Nesta etapa do projeto, foi desenvolvida a parte de estilização integração do backend com o frontend do gerenciador de tarefas. Para tal, em termos de código, foi implementado o arquivo `app.js` na pasta `public/js` que contém a lógica de manipulação das tarefas, como adicionar, editar, excluir e marcar como concluída. Além disso, foi criado o arquivo `style.css`, também na pasta `public/css` que possui os estilos da aplicação, ou seja, toda a parte de design visual para o usuário final.

<div align="center">
  <img src= "/assets/print1GerendiadorTarefas.png" width="100%">
  <sub>Fonte: Autoria própia (2025)</sub>
</div>

---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

&ensp;A seguir, está o vídeo demonstrativo do sistema web, mostrando como se inicia o gerenciador de tarefas e suas funcionalidades.
          https://drive.google.com/file/d/1sC4PqdSjayEyAIq_t601ikDmYedkEkr6/view?usp=drive_link


&ensp;O desenvolvimento do sistema web foi concluído com sucesso, entregando uma aplicação completa e funcional para gerenciamento de tarefas pessoais. O sistem&a implementa a arquitetura MVC (Model-View-Controller) utilizando Node.js, Express.js, PostgreSQL e interface web responsiva.

#### Funcionalidades Implementadas

&ensp;O sistema entregue possui todas as operações CRUD (Create, Read, Update, Delete) para gerenciamento de tarefas, além de funcionalidades avançadas como marcação de tarefas como concluídas e interface intuitiva com modais personalizados.

**Interface Principal do Sistema:**

<div align="center">
  <img src="/assets/print1GerenciadorTarefas.png" width="100%">
  <sub>Figura 1: Interface principal do Gerenciador de Tarefas - Fonte: Autoria própria (2025)</sub>
</div>

&ensp;A interface principal apresenta um design moderno com fundo em gradiente lilás, utilizando a fonte Poppins para melhor legibilidade. O sistema exibe um formulário para criação de novas tarefas e uma lista organizada das tarefas existentes.

**Criação de Tarefas:**

<div align="center">
  <img src="/assets/criarTarefa.png" width="100%">
  <sub>Figura 2: Funcionalidade de criação de nova tarefa - Fonte: Autoria própria (2025)</sub>
</div>

&ensp;O sistema permite a criação de tarefas com título obrigatório, descrição opcional e prazo de conclusão. A interface valida os dados e fornece feedback visual ao usuário.

**Edição de Tarefas:**

<div align="center">
  <img src="/assets/editarTarefa.png" width="100%">
  <sub>Figura 3: Modal de edição de tarefa existente - Fonte: Autoria própria (2025)</sub>
</div>

&ensp;A funcionalidade de edição utiliza um modal personalizado que permite modificar todos os campos da tarefa, mantendo a experiência do usuário fluida e intuitiva.

**Confirmação de Atualização:**

<div align="center">
  <img src="/assets/tarefaAtualizada.png" width="100%">
  <sub>Figura 4: Confirmação visual de tarefa atualizada - Fonte: Autoria própria (2025)</sub>
</div>

&ensp;O sistema fornece feedback imediato ao usuário através de mensagens de sucesso personalizadas, confirmando que as operações foram realizadas com êxito.

**Conclusão de Tarefas:**

<div align="center">
  <img src="/assets/tarefaConcluida.png" width="100%">
  <sub>Figura 5: Funcionalidade de marcar tarefa como concluída - Fonte: Autoria própria (2025)</sub>
</div>

&ensp;Uma funcionalidade especial permite marcar tarefas como concluídas, removendo-as da lista ativa e exibindo uma mensagem de confirmação personalizada.

**Exclusão de Tarefas:**

<div align="center">
  <img src="/assets/excluirTarefa.png" width="100%">
  <sub>Figura 6: Modal de confirmação para exclusão de tarefa - Fonte: Autoria própria (2025)</sub>
</div>

&ensp;Para operações mais "perigosas" como excluir uma tarefa, criei modais de confirmação personalizados. Não queria usar aqueles alertas feios padrão do navegador, então desenvolvi popups que seguem o mesmo design do site e perguntam se o usuário tem certeza da ação.

#### O que desenvolvi tecnicamente

**No Backend:**
- Criei uma API REST completa com todos os endpoints necessários para as operações básicas
- Organizei tudo seguindo a arquitetura MVC, separando bem as responsabilidades de cada parte
- Integrei com o banco PostgreSQL usando o Supabase (que facilitou muito a configuração!)
- Implementei tratamento de erros e validações para evitar problemas
- Configurei middlewares para CORS e parsing de JSON

**No Frontend:**
- Desenvolvi uma interface responsiva usando HTML5, CSS3 e JavaScript puro (sem frameworks)
- Caprichei no design com gradientes lilás e a fonte Poppins que deixou tudo mais moderno
- Criei modais personalizados ao invés de usar os alertas padrão do navegador
- Adicionei mensagens de feedback visual para o usuário sempre saber o que está acontecendo
- Coloquei algumas animações sutis que deixaram a experiência mais agradável

**No Banco de Dados:**
- Estruturei uma tabela simples mas eficiente para as tarefas com os campos essenciais
- Configurei a conexão com o Supabase usando SSL e pool de conexões
- Criei scripts automatizados para inicializar e popular o banco com dados de exemplo

&ensp;No final, consegui entregar um sistema completo e funcional que realmente resolve o problema de gerenciar tarefas pessoais. Foi um projeto desafiador mas muito gratificante, onde pude aplicar várias tecnologias e boas práticas que aprendi.

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

&ensp;Como pontos fortes durante a construção do projeto, posso destacar o ganho de conhecimento sobre como funciaona, na prática, um projeto no padrão MVC, juntamente com a integração da solução com um banco de dados. Vale-se destacar que gostei bastante de trabahar e aprender novas linguagens, como o CSS.


&ensp;Partindo agora para os pontos que devem ser melhorados, eu diria que há a necessidade de aprofundar meus conhecimentos tanto em CSS como em JavaScript. Com base nessas melhorias, eu adicionaria funcionalidades como: Telas de login para que vários usuários possam usar o sistema, adicionar categorias para prioridade das tarefas, sistema de notiificações para quando uma tarefa estiver próxima da data de conclusão, entre outras.



## <a name="c5"></a>5. Referências

_Incluir as principais referências de seu projeto, para que o leitor possa consultar caso ele se interessar em aprofundar._<br>

---
---