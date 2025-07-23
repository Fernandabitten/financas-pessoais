import { BASE_API_URL, fetchComErro } from "../../scripts/api.js";

const temaSalvo = localStorage.getItem("tema") || "dark";
document.documentElement.classList.add(`theme-${temaSalvo}`);

export async function ativarHeader(container) {
  // Carrega o CSS uma única vez
  const cssId = "header-css";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "components/header/header.css";
    document.head.appendChild(link);
  }

  // Aguarda o DOM estar totalmente pronto
  await new Promise((resolve) => {
    if (document.readyState === "complete") return resolve();
    window.addEventListener("load", resolve);
  });

  // Seleciona os elementos
  const avatar = container.querySelector("#avatar");
  const userMenu = container.querySelector("#user-menu");
  const logoutBtn = container.querySelector("#logout-btn");
  const saudacaoEl = container.querySelector(".user-area strong");
  const editProfileBtn = document.getElementById("edit-profile-btn");

  // Se os elementos essenciais não existem, não continua
  if (!avatar || !userMenu || !logoutBtn || !saudacaoEl) return;

  // Mostra saudação com nome do usuário autenticado
  try {
    const res = await fetchComErro(`${BASE_API_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    if (res?.nome) {
      saudacaoEl.textContent = `Olá, ${res.nome}`;
    }
  } catch (e) {
    console.warn("Usuário não autenticado ou erro ao buscar dados");
  }

  // Alterna exibição do menu do usuário
  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    const visivel = userMenu.style.display === "block";
    userMenu.style.display = visivel ? "none" : "block";
  });

  // Fecha menu ao clicar fora
  document.addEventListener("click", () => {
    userMenu.style.display = "none";
  });

  // Previne o fechamento ao clicar no próprio menu
  userMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Logout do usuário
  logoutBtn.addEventListener("click", async () => {
    const res = await fetchComErro(
      `${BASE_API_URL}/logout`,
      { method: "POST", credentials: "include" },
      "Erro ao sair"
    );

    if (res !== null) {
      window.location.href = "login.html";
    }
  });

  // Redireciona para a edição do perfil (se botão existir)
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      window.location.href = "pages/profile.html";
    });
  }

  // Alternância de tema (claro/escuro)
  const toggleThemeBtn = container.querySelector("#toggle-theme-btn");
  const html = document.documentElement;

  function atualizaIconeTema() {
    if (!toggleThemeBtn) return;
    if (html.classList.contains("theme-dark")) {
      toggleThemeBtn.innerHTML =
        '<i class="fas fa-moon"></i> Alterar Tema <span class="sr-only">Alternar tema</span>';
    } else {
      toggleThemeBtn.innerHTML =
        '<i class="fas fa-sun"></i> Alterar Tema <span class="sr-only">Alternar tema</span>';
    }
  }

  // Mostra ícone correto ao abrir
  atualizaIconeTema();

  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener("click", () => {
      const isDark = html.classList.contains("theme-dark");
      const newTheme = isDark ? "light" : "dark";

      html.classList.remove(`theme-${isDark ? "dark" : "light"}`);
      html.classList.add(`theme-${newTheme}`);
      localStorage.setItem("tema", newTheme);

      atualizaIconeTema();
      document.dispatchEvent(new Event("themechange"));
    });
  }
}
