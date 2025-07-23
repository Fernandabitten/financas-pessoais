export async function carregarComponente(id, arquivo, callback) {
  const container = document.getElementById(id);
  if (!container || container.classList.contains("loaded")) return;

  try {
    const res = await fetch(arquivo);
    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
    let html = await res.text();

    // Personalizações baseadas no ID
    switch (id) {
      case "info-bar-placeholder":
        html = substituirTitulo(html, container.dataset.title, "Título Padrão");
        break;

      case "modal-placeholder":
        html = substituirTitulo(html, container.dataset.title, "Título Padrão");
        break;

      case "tabela-placeholder":
        html = configurarTabela(html, container.dataset);
        break;
    }

    container.innerHTML = html;
    container.classList.add("loaded");

    if (typeof callback === "function") callback(container);
    return container;
  } catch (err) {
    console.error(`Erro ao carregar ${arquivo}:`, err);
  }
}

function substituirTitulo(html, titulo, padrao, marcador = "Título Padrão") {
  return html.replace(marcador, titulo || padrao);
}

function configurarTabela(html, { acao, total }) {
  const mostrarAcao = acao === "true";
  const mostrarTotal = total === "true";

  html = html.replace("<!--COLUNA_ACAO-->", mostrarAcao ? "<th>Ação</th>" : "");

  const footerHtml = mostrarTotal
    ? `<tfoot>
         <tr>
           <td colspan="3"></td>
           <td><strong>Total</strong></td>
           <td id="total">R$ 0,00</td>
           ${mostrarAcao ? "<td></td>" : ""}
         </tr>
       </tfoot>`
    : "";

  return html.replace("<!--FOOTER_TOTAL-->", footerHtml);
}
