# Projeto Finanças Pessoais

![Status](https://img.shields.io/badge/progresso-100%25-green?style=for-the-badge)

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)
![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-F0DB4F?style=for-the-badge&logo=javascript&logoColor=323330)

![Node.js](https://img.shields.io/badge/Node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=white)
![express-session](https://img.shields.io/badge/express--session-ff69b4?style=for-the-badge)
![bcrypt](https://img.shields.io/badge/bcrypt-4B8BBE?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-07405E.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=000)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Gemini 2.0 Flash](https://img.shields.io/badge/Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)

👉 [Acesse o deploy aqui!!](https://financas-pessoais-nu-ten.vercel.app/login.html)

## Sobre o projeto

Aplicação full stack para gestão de finanças pessoais, permitindo cadastro e autenticação de usuários, registro e consulta de lançamentos, geração de gráficos, exportação de dados Aplicação full stack para controle de finanças pessoais, permitindo cadastro de usuários, autenticação segura por sessão, lançamentos financeiros, relatórios dinâmicos, exportação de dados e análise automática via inteligência artificial. Inclui modo escuro/claro, edição de perfil e acompanha protótipo original no Figma.

Este projeto foi desenvolvido como **Projeto Final** da disciplina **Desenvolvimento Web II** do **IFCE**, cujo objetivo é aplicar na prática os conceitos de **requisições HTTP** e **APIs RESTful**, utilizando os métodos **GET**, **POST**, **PUT** e **DELETE** para manipular recursos via uma interface web. **Persistencia dos dados com SQLite, Node.js, autenticação, controle de Sessões e Proteção de Rotas, utilizando bcrypt e express-session**

## Tecnologias Utilizadas

- **Frontend**:
  HTML5,
  CSS3,
  JavaScript (Vanilla)
- **Backend**:
  Node.js,
  Express.js,
  SQLite (armazenamento local de dados),
  bcrypt (hash de senhas),
  express-session (gerenciamento de sessões),
  dotenv (variáveis de ambiente)
- **Hospedagem**:
  - Frontend: GitHub Pages
  - Backend: Render

---

## Funcionalidades

- ### Cadastro, edição e autenticação de usuários

  - Registro com nome, email e senha (senhas criptografadas)
  - Gerenciamento de sessões (express-session)
  - Login seguro e proteção de rotas
  - Edição de nome e senha

- ## Lançamentos financeiros

  - Cadastrar entradas/saídas com tipo, valor, categoria, descrição, data
  - Listagem, edição, exclusão e filtros (tipo/categoria/período)
  - Visualização de totais (entradas, saídas, saldo)

- ## Relatórios dinâmicos e gráficos

  - Listas e totais atualizados em tempo real pelo DOM
  - Gráficos via Chart.js: pizza por categoria e barras por período

- ## Exportação de dados

  - Download dos lançamentos em formato SVG

- ## Resumo financeiro com IA

  - Geração automática de análise e sugestões financeiras pelo Gemini (Google Generative AI)
  - Resumo de desempenho, dicas práticas e consolidados em JSON por categoria

- ## Designer

  - Prototipação visual original feita no Figma

- ## Design
  - Prototipação visual original feita no **Figma** e serve como guia para a implementação das páginas HTML.  
    Acesse o protótipo interativo clicando no link abaixo:  
    👉 [Protótipo no Figma](https://www.figma.com/proto/cHjB1mahWFq8FTedooHL8X/Sistema-de-Gest%C3%A3o-Finnanceira-Pessoal?node-id=54-806&p=f&t=O1E4mtFvgd4wAINR-0&scaling=min-zoom&content-scaling=fixed&page-id=48%3A1436&starting-point-node-id=54%3A806)
    Você deve ter uma conta <a href="https://www.figma.com/">Figma</a> para acessá-lo.

---

## Estrutura do projeto

```
financas-pessoais/
├── backend/
│   ├── controllers/
│   │   ├── authController.js               # Lógica de cadastro e login
│   │   ├── transactionController.js        # Lógica dos lançamentos financeiros
│   │   └── aiServiceController.js          # Lógica para resumos IA
│   ├── middleware/
│   │   └── authMiddleware.js               # Proteção de rotas/sessão
│   ├── models/
│   │   └── transaction.js                  # Modelo dos lançamentos
│   │   ├── userModel.js                    # Modelo dos usuarios
│   ├── routes/
│   │   ├── authRoutes.js                   # Rotas de cadastro/login
│   │   ├── transactionRoutes.js            # Rotas dos lançamentos financeiros
│   │   └── aiServiceRoutes.js              # Rotas para resumos IA
│   ├── services/
│   │   └── aiService.js                    # Serviço de integração IA
│   ├── banco.db                            # Banco SQLite (users, transactions)
│   ├── .env                                # Variáveis ambiente
│   ├── .env.exemplo                        #  Exemplo de variáveis de ambiente necessárias para rodar a aplicação. Preencha com seus próprios valores e renomeie para .env
│   ├── server.js                           # Inicialização do servidor Node.js
│   ├── package.json                        # Dependências backend
│   └── package-lock.json
├── frontend/
│   ├── components/                         # Componentes HTML reutilizáveis
│   │   ├── header.html
│   │   ├── sidebar.html
│   │   ├── table.html
│   │   └── ...                             # Outros componentes HTML reutilizáveis
│   ├── images/
│   │   └── ...                             # Imagens e ícones de interface
│   ├── scripts/
│   │   ├── index.js                        # Lógica principal: CRUD, filtros, DOM, fetch
│   │   ├── componente.js           # Carrega e insere HTML dinâmico
│   │   └── ...                             # Outros scripts específicos
│   ├── styles/
│   │   ├── style.css
│   │   ├── styles-auth.css
│   │   └── ...                             # Outros CSS (dashboard, temas, etc)
│   ├── index.html                          # Estrutura principal da aplicação; carrega componentes dinâmicos
│   ├── login.html                          # Tela de login/cadastro
│   ├── register.html                       # Tela deCadastro de usuário
└── └── README.md
o
```

## Configuração e Execução

1. Clone o repositório

```
git clone https://github.com/Fernandabitten/financas-pessoais.git
cd financas-pessoais
```

2. Configuração backend

- Crie o arquivo .env no backend e preencha:

```
  NODE_ENV=development # Troque para production para produção
  SESSION_SECRET=sua_chave_secreta # Segredo utilizado para sessões
  GEMINI_API_KEY=sua_chave_api_gemini # Chave API Gemini para integração IA
```

3. Instale as dependências do backend

```
  cd backend
  npm install
```

4. Inicie o servidor backend:

```
npm start
```

5. Acesse o frontend:

- Use um servidor local (ex: Live Server do VSCode) para abrir frontend/login.html.

> O backend deve estar rodando para autenticação e operações.

## Como usar:

1. Cadastre-se e faça login.
2. Registre lançamentos financeiros em contas a pagar e contas a receber.
3. Utilize filtros para visualizar totais e gráficos.
4. Baixe seus registro em SVG.
5. Obtenha resumo e dicas personalizadas via IA

## Links Importantes

- 🔗 Frontend: [Deploy no GitHub Pages](https://fernandabitten.github.io/financas-pessoais/frontend/login.html)
- 🔗 Backend: [Deploy no Render](https://financas.onrender.com)
- 🔗 Protótipo: [Figma](https://www.figma.com/proto/cHjB1mahWFq8FTedooHL8X/Sistema-de-Gest%C3%A3o-Finnanceira-Pessoal?node-id=54-806&p=f&t=O1E4mtFvgd4wAINR-0&scaling=min-zoom&content-scaling=fixed&page-id=48%3A1436&starting-point-node-id=54%3A806)

---

## Galeria de Imagens

<details>
  <summary>Ver Screenshots</summary>
  <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
  </div>
</details>

## Licença

Este projeto está licenciado sob a licença MIT.

## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua contribuição
3. Faça commits descritivos e claros
4. Abra um pull request explicando suas mudanças

#### "Fique à vontade para adaptar conforme suas necessidades, explorar novas ideias e construir soluções inovadoras!"
