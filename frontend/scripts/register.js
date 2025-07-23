import { BASE_API_URL } from "./api.js";

const form = document.querySelector("form");
const nameInput = document.querySelector('input[type="text"]');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const errorDiv = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorDiv.textContent = "";

  const nome = nameInput.value.trim();
  const email = emailInput.value.trim();
  const senha = passwordInput.value;

  if (!nome || !email || !senha) {
    errorDiv.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  try {
    const response = await fetch(`${BASE_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (response.ok) {
      window.location.href = "../login.html";
    } else {
      const { erro } = await response.json();
      errorDiv.textContent = "Erro: " + (erro || "Não foi possível cadastrar.");
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    errorDiv.textContent = "Erro de conexão com o servidor.";
  }
});
