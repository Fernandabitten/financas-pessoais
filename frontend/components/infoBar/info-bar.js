import { fetchComErro, BASE_API_URL } from "../../scripts/api.js";

export async function ativarInfoBar(container, callback) {
  // Carrega o CSS apenas uma vez
  const cssId = "info-bar.css";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "components/infoBar/info-bar.css";
    document.head.appendChild(link);
  }

  const anoSelect = container.querySelector("#ano-select");
  const mesSelect = container.querySelector("#mes-select");
  if (!anoSelect || !mesSelect) return;

  // Mapeamento de meses
  const nomeMesPorNumero = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
  };

  const mesesPorAno = {};
  let transacoes = [];

  try {
    const dados = await fetchComErro(
      `${BASE_API_URL}/transactions`,
      { credentials: "include" },
      "Erro ao carregar os lançamentos"
    );

    if (!Array.isArray(dados)) return;
    transacoes = dados;

    // Organiza meses por ano
    for (const t of transacoes) {
      const [ano, mes] = t.data.split("-");
      if (!mesesPorAno[ano]) mesesPorAno[ano] = new Set();
      mesesPorAno[ano].add(mes);
    }

    preencherSelects();

    // Listeners
    anoSelect.addEventListener("change", () => {
      atualizarMeses(anoSelect.value);
      emitirCallback();
    });

    mesSelect.addEventListener("change", emitirCallback);

    // Dispara o callback inicial
    emitirCallback();
  } catch (error) {
    console.error("Erro ao ativar infoBar:", error);
  }

  // -----------------------------
  // Funções auxiliares
  // -----------------------------

  function preencherSelects() {
    const anos = Object.keys(mesesPorAno).sort();
    const anoAtual = new Date().getFullYear().toString();
    const mesAtual = (new Date().getMonth() + 1).toString().padStart(2, "0");

    anoSelect.innerHTML = "";
    anos.forEach((ano) => {
      const opt = document.createElement("option");
      opt.value = ano;
      opt.textContent = ano;
      if (ano === anoAtual) opt.selected = true;
      anoSelect.appendChild(opt);
    });

    atualizarMeses(anoAtual, mesAtual);
  }

  function atualizarMeses(anoSelecionado, mesDefault = null) {
    mesSelect.innerHTML = "";

    // Opção "Todos"
    const optTodos = document.createElement("option");
    optTodos.value = "todos";
    optTodos.textContent = "Todos";
    if (mesDefault === "todos") optTodos.selected = true;
    mesSelect.appendChild(optTodos);

    const meses = Array.from(mesesPorAno[anoSelecionado] || []).sort();
    meses.forEach((mes) => {
      const opt = document.createElement("option");
      opt.value = mes;
      opt.textContent = nomeMesPorNumero[mes] || mes;
      if (mes === mesDefault) opt.selected = true;
      mesSelect.appendChild(opt);
    });
  }

  function emitirCallback() {
    callback({
      ano: anoSelect.value,
      mes: mesSelect.value,
      transacoes,
    });
  }
}
