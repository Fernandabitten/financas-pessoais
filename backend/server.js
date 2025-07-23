// Importações principais
const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const cors = require("cors");
require("dotenv").config();

// Inicialização
const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Importação de rotas
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionsRoutes");
const iaServiceRoutes = require("./routes/iaServiceRoutes");
const iaResumoRoutes = require("./routes/iaServiceRoutes");

// Checagem de variáveis obrigatórias
if (!process.env.SESSION_SECRET) {
  console.error("Erro: SESSION_SECRET não definido.");
  process.exit(1);
}

// Middlewares globais
app.use(express.json());

// CORS com credenciais e domínios permitidos
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://fernandabitten.github.io",
  "https://financas-pessoais-nu-ten.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Origem não permitida pelo CORS"));
    },
    credentials: true,
  })
);

// Session Store (memorystore evita memory leak, ideal para dev/single host)
app.use(
  session({
    store: new MemoryStore({ checkPeriod: 86400000 }), // Limpa sessões expiradas a cada 24h
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction, // true em produção (HTTPS), false em dev (HTTP)
      sameSite: isProduction ? "none" : "lax", // "none" p/ domínios separados, "lax" p/ dev local
      maxAge: 86400000, // duração do cookie: 24h
    },
  })
);

// Rotas públicas simples
app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

// Rotas privadas/autenticadas
app.use(authRoutes);
app.use(transactionRoutes);
app.use(iaServiceRoutes);
app.use(iaResumoRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
