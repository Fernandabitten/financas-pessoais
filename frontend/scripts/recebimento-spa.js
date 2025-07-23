import { BASE_API_URL } from "./api.js";
import { carregarComponente } from "./components.js";
import { ativarInfoBar } from "../components/infoBar/info-bar.js";
import { ativarTabela } from "../components/table/table.js";
import {
  ativarModal,
  atualizarCategoriasPorTipo,
} from "../components/modal/modal.js";

export async function iniciar() {
  const [infoBarContainer, tabelaEl] = await Promise.all([
    carregarComponente(
      "info-bar-placeholder",
      "./components/infoBar/info-bar.html"
    ),
    carregarComponente(
      "tabela-placeholder",
      "./components/table/table.html",
      ativarTabela
    ),
    carregarComponente("modal-placeholder", "./components/modal/modal.html"),
  ]);

  const tabelaRecebimentos = tabelaEl.querySelector("#lista-lancamentos");
  const filtroDescricao = document.getElementById("filtro-descricao");
  const totalEntradasEl = document.getElementById("total");

  let todasEntradas = [];

  function capitalize(texto) {
    return texto
      .toLowerCase()
      .replace(/(?:^|\s|[-/()])[a-z]/g, (match) => match.toUpperCase());
  }

  ativarInfoBar(infoBarContainer, ({ ano, mes, transacoes }) => {
    const entradasFiltradas = transacoes.filter((t) => {
      const [anoT, mesT] = t.data.split("-");
      return (
        t.tipo === "entrada" &&
        anoT === ano &&
        (mes === "todos" || mesT === mes)
      );
    });

    todasEntradas = entradasFiltradas;
    atualizarTabelaFiltrada();
  });

  async function recarregarTransacoes() {
    try {
      const res = await fetch(`${BASE_API_URL}/transactions`, {
        credentials: "include",
      });
      const dados = await res.json();

      const ano = document.getElementById("ano-select")?.value;
      const mes = document.getElementById("mes-select")?.value;

      if (!ano || !mes) return;

      todasEntradas = dados.filter((t) => {
        const [anoT, mesT] = t.data.split("-");
        return t.tipo === "entrada" && anoT === ano && mesT === mes;
      });

      atualizarTabelaFiltrada();
    } catch (error) {
      console.error("Erro ao recarregar transações:", error);
    }
  }

  function atualizarTabelaFiltrada() {
    const termo = filtroDescricao.value.trim().toLowerCase();
    const filtradas = todasEntradas.filter((t) =>
      t.descricao?.toLowerCase().includes(termo)
    );

    renderizarTabela(filtradas);
  }

  function renderizarTabela(lista) {
    tabelaRecebimentos.innerHTML = "";

    let total = 0;

    for (const t of lista) {
      const valor = Number(t.valor);
      total += valor;

      const dataFormatada = (() => {
        const [ano, mes, dia] = t.data.split("-");
        return `${dia}/${mes}/${ano}`;
      })();
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${dataFormatada}</td>
          <td>${capitalize(t.tipo)}</td>
          <td>${capitalize(t.categoria)}</td>
          <td>${capitalize(t.descricao || "")}</td>
          <td>${valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</td>          <td>
            <button type="button" class="btn-edit" data-id="${
              t.id
            }"><i class="fas fa-pen"></i></button>
            <button type="button" class="btn-delete" data-id="${
              t.id
            }"><i class="fas fa-trash"></i></button>
          </td>
        `;
      tabelaRecebimentos.appendChild(row);
    }

    totalEntradasEl.textContent = `${total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;

    tabelaRecebimentos.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        const transacao = lista.find((t) => t.id == id);
        if (!transacao) return;

        preencherModal(transacao);
        document.getElementById("modal-form").classList.add("show");
      });
    });

    tabelaRecebimentos.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = btn.dataset.id;

        const confirmar = confirm(
          "Tem certeza que deseja excluir este lançamento?"
        );
        if (!confirmar) return;

        try {
          const res = await fetch(`${BASE_API_URL}/transactions/${id}`, {
            method: "DELETE",
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error("Erro ao excluir.");
          }

          // Atualiza a tabela depois de excluir
          recarregarTransacoes();
        } catch (err) {
          alert("Erro ao excluir lançamento.");
          console.error(err);
        }
      });
    });
  }

  filtroDescricao.addEventListener("input", atualizarTabelaFiltrada);

  function preencherModal(t) {
    const modalRoot = document.getElementById("modal-placeholder");
    modalRoot.querySelector("#modal-id").value = t.id;
    modalRoot.querySelector("#modal-data").value = t.data;
    modalRoot.querySelector("#modal-tipo").value = t.tipo;
    atualizarCategoriasPorTipo(t.tipo);
    modalRoot.querySelector("#modal-categoria").value = t.categoria;
    modalRoot.querySelector("#modal-descricao").value = t.descricao;
    modalRoot.querySelector("#modal-valor").value = t.valor;
    modalRoot.querySelector("h3").textContent = "Editar Receita";
  }

  ativarModal({
    apiBaseUrl: `${BASE_API_URL}/transactions`,
    onSalvar: recarregarTransacoes,
    tipoPadrao: "entrada",
  });
}
