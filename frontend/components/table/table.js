export function ativarTabela(container) {
  if (!container) return;

  const mostrarColunaAcao = container.dataset.acao === "true";
  const mostrarTotal = container.dataset.total === "true";

  // Aplica o CSS uma única vez
  const cssId = "tabela-css";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "components/table/table.css";
    document.head.appendChild(link);
  }

  // Exibir ou ocultar a coluna de ação
  const colunaAcao = container.querySelector(".col-acao");
  if (colunaAcao) {
    colunaAcao.style.display = mostrarColunaAcao ? "" : "none";
  }

  // Exibir ou ocultar o rodapé da tabela (totais)
  const tfoot = container.querySelector(".tabela-total");
  if (tfoot) {
    tfoot.style.display = mostrarTotal ? "" : "none";
  }
}
