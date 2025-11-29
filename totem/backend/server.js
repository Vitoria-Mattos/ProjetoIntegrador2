import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();
const PORT = 3000;

// Habilitar JSON e CORS
app.use(cors());
app.use(express.json());

// Rotas
app.use(router);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
