import { BASE_API_URL } from "./api.js";

const form = document.querySelector(".form");
const [inputNome, inputEmail, inputSenhaAtual, inputNovaSenha] = form.elements;

// Função para buscar os dados do usuário
async function carregarPerfil() {
  try {
    const res = await fetch(`${BASE_API_URL}/me`, { credentials: "include" });

    if (!res.ok) {
      window.location.href = "login.html";
      return;
    }

    const user = await res.json();
    inputNome.value = user.nome;
    inputEmail.value = user.email;
    inputEmail.disabled = true;
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    alert("Erro ao carregar perfil.");
  }
}

// Função para enviar atualização do perfil
async function atualizarPerfil(e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  const body = {
    nome: inputNome.value,
    senhaAtual: inputSenhaAtual.value,
    novaSenha: inputNovaSenha.value,
  };

  try {
    const res = await fetch(`${BASE_API_URL}/update-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Perfil atualizado com sucesso!");
      inputSenhaAtual.value = "";
      inputNovaSenha.value = "";
      setTimeout(() => (window.location.href = "../index.html"), 100);
    } else {
      alert(`Erro: ${data.erro || "Falha na atualização."}`);
    }
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
    alert("Erro ao enviar dados.");
  }
}

// Inicializa a tela
carregarPerfil();
form.addEventListener("submit", atualizarPerfil);
