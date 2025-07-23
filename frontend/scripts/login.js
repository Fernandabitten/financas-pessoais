import { BASE_API_URL } from "./api.js";

const form = document.querySelector("form");
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const errorDiv = document.getElementById("error-message");

const toggleThemeBtn = document.getElementById("toggle-theme-btn");
const html = document.documentElement;

// Função para atualizar o ícone conforme o tema
function atualizaIcone() {
  if (html.classList.contains("theme-dark")) {
    toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// Inicializa o ícone de tema ao abrir a página
if (toggleThemeBtn) {
  atualizaIcone();

  toggleThemeBtn.addEventListener("click", () => {
    const isDark = html.classList.contains("theme-dark");
    const novoTema = isDark ? "light" : "dark";

    html.classList.remove(`theme-${isDark ? "dark" : "light"}`);
    html.classList.add(`theme-${novoTema}`);

    localStorage.setItem("tema", novoTema);
    atualizaIcone();
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    errorDiv.textContent = "Preencha todos os campos.";
    return;
  }

  try {
    const response = await fetch(`${BASE_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha: password }),
    });

    if (response.ok) {
      window.location.href = "index.html";
    } else {
      const { erro } = await response.json();
      errorDiv.textContent = "Erro: " + (erro || "Login inválido.");
    }
  } catch (err) {
    console.error("Erro de conexão:", err);
    errorDiv.textContent = "Erro de conexão com o servidor.";
  }
});
