export function ativarSidebar(container) {
  carregarEstilosSidebar();

  const menuLinks = container.querySelectorAll("#toggle-menu a");
  const paginaAtual = obterNomePaginaAtual();

  menuLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isIndex = paginaAtual === "" && href === "index.html";

    if (href === paginaAtual || isIndex) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function carregarEstilosSidebar() {
  const idCSS = "sidebar-css";

  if (!document.getElementById(idCSS)) {
    const link = document.createElement("link");
    link.id = idCSS;
    link.rel = "stylesheet";
    link.href = "components/sidebar/sidebar.css";
    document.head.appendChild(link);
  }
}

function obterNomePaginaAtual() {
  const caminho = window.location.pathname;
  return caminho.substring(caminho.lastIndexOf("/") + 1);
}
