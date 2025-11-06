# TaskMaster - Gerenciador de Tarefas

Um aplicativo completo de gerenciamento de tarefas com backend Node.js, MongoDB e autenticação JWT.

## 🚀 Funcionalidades

- ✅ Sistema de autenticação completo (JWT)
- ✅ Backend Node.js + Express + MongoDB
- ✅ CRUD de tarefas com API REST
- ✅ Dashboard personalizado
- ✅ Filtros (Todas, Pendentes, Concluídas)
- ✅ Estatísticas em tempo real
- ✅ Design responsivo e moderno
- ✅ Deploy pronto para Vercel

## 📁 Estrutura do Projeto

```
TaskMaster/
│
├── api/                    # Backend Node.js
│   ├── config/
│   │   └── database.js     # Configuração MongoDB
│   ├── middleware/
│   │   └── auth.js         # Middleware de autenticação
│   ├── models/
│   │   ├── User.js         # Model de usuário
│   │   └── Task.js         # Model de tarefa
│   ├── routes/
│   │   ├── auth.js         # Rotas de autenticação
│   │   └── tasks.js        # Rotas de tarefas
│   └── index.js            # Servidor Express
│
├── index.html              # Página de login
├── dashboard.html          # Dashboard de tarefas
├── styles.css              # Estilos globais
├── auth.js                 # Lógica de autenticação (frontend)
├── app.js                  # Lógica de tarefas (frontend)
├── package.json            # Dependências
├── vercel.json             # Configuração Vercel
├── .env                    # Variáveis de ambiente (não commitado)
└── .env.example            # Exemplo de variáveis
```

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Fetch API

## 📦 Instalação Local

### 1. Clone o repositório
```bash
git clone https://github.com/samuel774368/0-ao-deploy.git
cd 0-ao-deploy
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_jwt
PORT=3000
```

### 4. Execute o servidor
```bash
npm start
```

Ou em modo desenvolvimento:
```bash
npm run dev
```

### 5. Acesse no navegador
```
http://localhost:3000
```

## 🌐 Deploy no Vercel

### 1. Instale o Vercel CLI (opcional)
```bash
npm install -g vercel
```

### 2. Faça login no Vercel
- Acesse: https://vercel.com
- Login com GitHub
- Importe o repositório `0-ao-deploy`

### 3. Configure as Variáveis de Ambiente no Vercel

No painel do Vercel, adicione:

```
MONGODB_URI = mongodb+srv://samuelfaminto_db_user:RhdCmUTEK3ENFViE@cluster0.vwscwc1.mongodb.net/taskmaster?retryWrites=true&w=majority
JWT_SECRET = taskmaster_secret_key_2025_production_change_this
```

### 4. Deploy Automático
Após configurar, o Vercel fará o deploy automaticamente!

## 🔐 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Fazer login

### Tarefas (Requer autenticação)
- `GET /api/tasks` - Listar todas as tarefas
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Health Check
- `GET /api/health` - Verificar status da API

## 🎨 Tema

Design moderno com gradientes roxos e interface clean, inspirado em aplicativos de produtividade modernos.

## ⌨️ Atalhos de Teclado

- `Ctrl + N` - Focar no campo de nova tarefa

## � Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Tokens com expiração de 7 dias
- CORS configurado
- Validação de dados no backend

## 📝 Notas

- MongoDB Atlas (Free Tier)
- Vercel (Free Tier)
- Totalmente gratuito para uso pessoal

## 🐛 Troubleshooting

### Erro de conexão com MongoDB
- Verifique se o IP 0.0.0.0/0 está liberado no MongoDB Atlas
- Confirme se a string de conexão está correta
- Verifique as credenciais do usuário do banco

### Erro 401 Unauthorized
- Token pode estar expirado (faça login novamente)
- Verifique se o JWT_SECRET é o mesmo no backend

## 📄 Licença

MIT License - Livre para uso pessoal e comercial

---

Desenvolvido com ❤️ por Samuel
