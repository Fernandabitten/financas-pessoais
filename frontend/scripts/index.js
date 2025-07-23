import { carregarComponente } from "./components.js";
import { ativarSidebar } from "../components/sidebar/sidebar.js";
import { ativarHeader } from "../components/header/header.js";

const mainContent = document.getElementById("main-content");

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function carregarPagina(nome) {
  try {
    const res = await fetch(`pages/${nome}.html`);
    if (!res.ok) throw new Error("Página não encontrada");

    const html = await res.text();

    // Aplica efeito suave
    mainContent.classList.remove("fade-enter", "fade-enter-active");
    void mainContent.offsetWidth; // força reflow (necessário para reiniciar animação)

    mainContent.innerHTML = html;
    // Aplica efeito suave
    mainContent.classList.remove("fade-enter", "fade-enter-active");
    void mainContent.offsetWidth; // força reflow (necessário para reiniciar animação)

    // Atualiza o título da página
    document.title = `Finanças Pessoais | ${capitalizar(nome)}`;

    // Importa dinamicamente o JS correspondente
    const modulo = await import(`./${nome}-spa.js`);
    if (typeof modulo.iniciar === "function") {
      modulo.iniciar();
    }
  } catch (erro) {
    mainContent.innerHTML = `<p style="color:red;">Erro ao carregar página: ${erro.message}</p>`;
  }
}

function atualizarActiveSidebar(pagina) {
  const links = document.querySelectorAll("#toggle-menu a");
  links.forEach((link) => {
    link.classList.toggle("active", link.dataset.pagina === pagina);
  });
}

async function init() {
  // Carrega header e sidebar fixos
  await Promise.all([
    carregarComponente(
      "sidebar-placeholder",
      "./components/sidebar/sidebar.html",
      ativarSidebar
    ),
    carregarComponente(
      "header-placeholder",
      "./components/header/header.html",
      ativarHeader
    ),
  ]);

  // Habilita navegação SPA via sidebar
  document
    .getElementById("sidebar-placeholder")
    .addEventListener("click", (e) => {
      e.preventDefault();
      const link = e.target.closest("a[data-pagina]");
      if (!link) return;

      const pagina = link.dataset.pagina;

      window.location.hash = pagina;
      atualizarActiveSidebar(pagina);
      carregarPagina(pagina);
    });

  // Detecta a página inicial via hash
  const paginaInicial = window.location.hash.replace("#", "") || "dashboard";
  atualizarActiveSidebar(paginaInicial);
  carregarPagina(paginaInicial);
}

document.addEventListener("DOMContentLoaded", init);
