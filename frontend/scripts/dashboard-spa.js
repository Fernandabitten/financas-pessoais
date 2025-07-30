import { BASE_API_URL } from "./api.js";
import { carregarComponente } from "./components.js";
import { ativarInfoBar } from "../components/infoBar/info-bar.js";
import { ativarTabela } from "../components/table/table.js";

let chartCategorias = null;
let chartPeriodo = null;
let ultimoStateDashboard = null;

// Inicie o Dashboard normalmente
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
  ]);

  const entradaEl = document.getElementById("entrada");
  const saidaEl = document.getElementById("saida");
  const saldoEl = document.getElementById("saldo");
  const barraEntrada = document.getElementById("barra-entrada");
  const barraSaida = document.getElementById("barra-saida");
  const graficoCategorias = document.getElementById("grafico-categorias");
  const graficoPeriodo = document.getElementById("grafico-periodo");
  const listaLancamentos = tabelaEl.querySelector("#lista-lancamentos");
  const h4Categorias = document.getElementById("titulo-categorias");
  const h4Periodo = document.getElementById("titulo-periodo");

  ativarInfoBar(infoBarContainer, ({ ano, mes, transacoes }) => {
    const mesFormatado = mes.toString().padStart(2, "0");
    const transacoesMesAno =
      mes === "todos"
        ? transacoes.filter((t) => t.data.startsWith(`${ano}-`))
        : transacoes.filter((t) => t.data.startsWith(`${ano}-${mesFormatado}`));

    const transacoesAno = transacoes.filter((t) =>
      t.data.startsWith(`${ano}-`)
    );

    renderizarDashboard({
      transacoesMesAno,
      transacoesAno,
      anoSelecionado: ano,
      mesSelecionado: mes,
      entradaEl,
      saidaEl,
      saldoEl,
      barraEntrada,
      barraSaida,
      graficoCategorias,
      graficoPeriodo,
      listaLancamentos,
      h4Categorias,
      h4Periodo,
    });
  });
}

async function carregarRecomendacao() {
  try {
    const { anoSelecionado, mesSelecionado, transacoesMesAno } =
      ultimoStateDashboard;
    const res = await fetch(`${BASE_API_URL}/recomendacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        transacoes: transacoesMesAno,
        ano: anoSelecionado,
        mes: mesSelecionado === "todos" ? null : Number(mesSelecionado),
      }),
    });
    const data = await res.json();
    document.getElementById("card-recomendacao").innerText = data.recomendacao;
  } catch (error) {
    console.error("Erro ao recarregar transações:", error);
  }

  // document.getElementById("gerar-explicacao").onclick = async () => {
  //   const modal = document.getElementById("modal-explicacao");
  //   const conteudo = document.getElementById("conteudo-modal");
  //   modal.classList.remove("oculto");
  //   conteudo.textContent = "Carregando explicação...";

  //   try {
  //     const res = await fetch(`${BASE_API_URL}/resumo-ia`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         transacoes: ultimoStateDashboard.transacoesMesAno,
  //         ano: ultimoStateDashboard.anoSelecionado,
  //         mes:
  //           ultimoStateDashboard.mesSelecionado === "todos"
  //             ? null
  //             : Number(ultimoStateDashboard.mesSelecionado),
  //       }),
  //     });

  //     const data = await res.json();
  //     conteudo.textContent =
  //       data.resumo?.resumoFinanceiro || "Nenhuma explicação disponível.";
  //   } catch (e) {
  //     conteudo.textContent =
  //       "Não foi possível carregar a explicação no momento.";
  //     console.error(e);
  //   }
  // };

  // document.getElementById("fechar-modal").onclick = () => {
  //   document.getElementById("modal-explicacao").classList.add("oculto");
  // };
  document.getElementById("gerar-explicacao").onclick = async () => {
    const modal = document.getElementById("modal-explicacao");
    const conteudo = document.getElementById("conteudo-modal");

    modal.classList.remove("oculto");
    conteudo.innerHTML = "<em>Carregando explicação...</em>";

    try {
      const res = await fetch(`${BASE_API_URL}/resumo-ia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          transacoes: ultimoStateDashboard.transacoesMesAno,
          ano: ultimoStateDashboard.anoSelecionado,
          mes:
            ultimoStateDashboard.mesSelecionado === "todos"
              ? null
              : Number(ultimoStateDashboard.mesSelecionado),
        }),
      });

      const data = await res.json();

      if (!data || !data.resumo) {
        conteudo.innerHTML = "Nenhuma explicação disponível.";
        return;
      }

      // Montar HTML formatado
      const { resumoFinanceiro, sugestoes, detalhes } = data.resumo;

      const formatarCategorias = (categorias) =>
        categorias
          .slice(0, 3) // mostrar só as 3 principais
          .map(
            (cat) =>
              `<li><strong>${
                cat.categoria
              }:</strong> R$ ${cat.valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}</li>`
          )
          .join("");

      const html = `
      <p>${resumoFinanceiro}</p>
      <br>
      <p><strong>Principais fontes de receita:</strong></p>
      <ul>${formatarCategorias(detalhes?.entradas?.categorias || [])}</ul>  
      <br>      
      <p><strong>Maiores despesas:</strong></p>
      <ul>${formatarCategorias(detalhes?.saidas?.categorias || [])}</ul>
      <br>      
      ${
        sugestoes?.length
          ? `
        <p><strong>Sugestões do Pila:</strong></p>
        <ul>
          ${sugestoes.map((s) => `<li>${s}</li> <br>`).join("")}
        </ul>
      `
          : ""
      }
    `;

      conteudo.innerHTML = html;
    } catch (e) {
      conteudo.innerHTML = "Não foi possível carregar a explicação no momento.";
      console.error(e);
    }
  };

  document.getElementById("fechar-modal").onclick = () => {
    document.getElementById("modal-explicacao").classList.add("oculto");
  };
}

// Função principal de renderização
function renderizarDashboard(params) {
  // Guarda os dados e os elementos DOM
  ultimoStateDashboard = { ...params };

  const {
    transacoesMesAno,
    transacoesAno,
    anoSelecionado,
    mesSelecionado,
    entradaEl,
    saidaEl,
    saldoEl,
    barraEntrada,
    barraSaida,
    graficoCategorias,
    graficoPeriodo,
    listaLancamentos,
    h4Categorias,
    h4Periodo,
  } = params;

  const chartsContainer = document.getElementById("charts-container");
  const mensagemVazia = document.getElementById("mensagem-vazia");
  const temLancamentos = transacoesMesAno.length > 0;

  if (chartsContainer && mensagemVazia) {
    chartsContainer.classList.toggle("oculto", !temLancamentos);
    mensagemVazia.classList.toggle("oculto", temLancamentos);
  } else {
    console.warn("Elemento(s) não encontrado(s):", {
      chartsContainer,
      mensagemVazia,
    });
  }

  if (!temLancamentos) {
    if (chartCategorias) chartCategorias.destroy();
    if (chartPeriodo) chartPeriodo.destroy();
    return;
  }

  atualizarTitulosGraficos(
    h4Categorias,
    h4Periodo,
    mesSelecionado,
    anoSelecionado
  );
  preencherTabela(transacoesMesAno, listaLancamentos);
  atualizarValores(
    transacoesMesAno,
    entradaEl,
    saidaEl,
    saldoEl,
    barraEntrada,
    barraSaida
  );

  const { totais, tipos } = calcularTotaisPorCategoria(transacoesMesAno);
  if (chartCategorias) chartCategorias.destroy();
  chartCategorias = criarGraficoCategorias(graficoCategorias, totais, tipos);

  const { porMesEntrada, porMesSaida } = calcularTotaisPorMes(transacoesAno);
  if (chartPeriodo) chartPeriodo.destroy();
  chartPeriodo = criarGraficoPeriodo(
    graficoPeriodo,
    porMesEntrada,
    porMesSaida,
    anoSelecionado,
    transacoesAno
  );
  carregarRecomendacao();
}

// Ouve a troca do tema pelo evento customizado
document.addEventListener("themechange", () => {
  if (!ultimoStateDashboard) return;
  if (chartCategorias) {
    chartCategorias.destroy();
    chartCategorias = null;
  }
  if (chartPeriodo) {
    chartPeriodo.destroy();
    chartPeriodo = null;
  }
  renderizarDashboard(ultimoStateDashboard);
});

// Restante do código (utilitários e helpers)
const nomesMeses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function capitalize(texto) {
  return texto
    .toLowerCase()
    .replace(/(?:^|\s|[-/()])[a-z]/g, (m) => m.toUpperCase());
}
function formatarDataISOParaBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function preencherTabela(transacoes, container) {
  container.innerHTML = "";

  // Ordenar por data decrescente (mais recente primeiro)
  const transacoesOrdenadas = [...transacoes].sort((a, b) =>
    b.data.localeCompare(a.data)
  );

  for (const t of transacoesOrdenadas) {
    const valor = Number(t.valor);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatarDataISOParaBR(t.data)}</td>
      <td>${capitalize(t.tipo)}</td>
      <td>${capitalize(t.categoria)}</td>
      <td>${capitalize(t.descricao || "")}</td>
      <td>${valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</td>
    `;
    container.appendChild(row);
  }
}
function atualizarTitulosGraficos(h4Categorias, h4Periodo, mes, ano) {
  if (mes === "todos") {
    h4Categorias.textContent = `Total por Categoria (Ano: ${ano})`;
  } else {
    const nomeMes = nomesMeses[parseInt(mes, 10) - 1];
    h4Categorias.textContent = `Total por Categoria (${nomeMes}/${ano})`;
  }
  h4Periodo.textContent = `Total por Período (Ano: ${ano})`;
}
function atualizarValores(
  transacoes,
  entradaEl,
  saidaEl,
  saldoEl,
  barraEntrada,
  barraSaida
) {
  let entrada = 0;
  let saida = 0;

  for (const t of transacoes) {
    const valor = Number(t.valor);
    if (t.tipo === "entrada") entrada += valor;
    else saida += valor;
  }

  const saldo = entrada - saida;
  const total = entrada + saida;
  entradaEl.textContent = entrada.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  saidaEl.textContent = saida.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  saldoEl.textContent = saldo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  barraEntrada.style.width = total > 0 ? `${(entrada / total) * 100}%` : "0%";
  barraSaida.style.width = total > 0 ? `${(saida / total) * 100}%` : "0%";
  saldoEl.style.color = saldo < 0 ? "red" : "";
}
function calcularTotaisPorCategoria(transacoes) {
  const totais = {};
  const tipos = {};
  for (const t of transacoes) {
    const valor = Number(t.valor);
    totais[t.categoria] = (totais[t.categoria] || 0) + valor;
    tipos[t.categoria] = t.tipo; // "entrada" ou "saida"
  }
  return { totais, tipos };
}
function calcularTotaisPorMes(transacoes) {
  const porMesEntrada = {};
  const porMesSaida = {};

  for (const t of transacoes) {
    const valor = Number(t.valor);
    const [anoT, mesT] = t.data.split("-");
    const chaveMes = `${anoT}-${mesT}`;
    if (t.tipo === "entrada") {
      porMesEntrada[chaveMes] = (porMesEntrada[chaveMes] || 0) + valor;
    } else {
      porMesSaida[chaveMes] = (porMesSaida[chaveMes] || 0) + valor;
    }
  }
  return { porMesEntrada, porMesSaida };
}
function criarGraficoCategorias(ctx, data, tipos) {
  const css = getComputedStyle(document.documentElement);
  const colorText = css.getPropertyValue("--color-text").trim();
  const colorBg = css.getPropertyValue("--color-primary").trim();

  const coresEntrada = [
    css.getPropertyValue("--entrada-1").trim(),
    css.getPropertyValue("--entrada-2").trim(),
    css.getPropertyValue("--entrada-3").trim(),
    css.getPropertyValue("--entrada-4").trim(),
    css.getPropertyValue("--entrada-5").trim(),
  ];
  const coresSaida = [
    css.getPropertyValue("--saida-1").trim(),
    css.getPropertyValue("--saida-2").trim(),
    css.getPropertyValue("--saida-3").trim(),
    css.getPropertyValue("--saida-4").trim(),
    css.getPropertyValue("--saida-5").trim(),
    css.getPropertyValue("--saida-6").trim(),
    css.getPropertyValue("--saida-7").trim(),
    css.getPropertyValue("--saida-8").trim(),
    css.getPropertyValue("--saida-9").trim(),
  ];
  const categoriasEntrada = Object.keys(data).filter(
    (cat) => tipos[cat] === "entrada"
  );
  const categoriasSaida = Object.keys(data).filter(
    (cat) => tipos[cat] === "saida"
  );
  const categoriasOrdenadas = [...categoriasEntrada, ...categoriasSaida];
  const valores = categoriasOrdenadas.map((cat) => data[cat]);
  const backgroundColor = categoriasOrdenadas.map((cat) =>
    tipos[cat] === "entrada"
      ? coresEntrada.shift() || css.getPropertyValue("--entrada-1").trim()
      : coresSaida.shift() || css.getPropertyValue("--saida-1").trim()
  );

  return new Chart(ctx, {
    type: "pie",
    data: {
      labels: categoriasOrdenadas,
      datasets: [
        {
          data: valores,
          backgroundColor,
          borderWidth: 0,
          borderColor: colorBg,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: colorText,
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: colorBg,
          titleColor: colorText,
          bodyColor: colorText,
          borderColor: "#37e29b",
          borderWidth: 1,
          usePointStyle: true,
          boxPadding: 5,
          titleFont: { weight: "bold" },
          bodyFont: { weight: "normal" },
          bodyPointStyle: "circle",
          callbacks: {
            title: (context) => capitalize(context[0].label || ""),
            label: (context) =>
              context.raw.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }),
          },
        },
      },
    },
  });
}
function criarGraficoPeriodo(ctx, entradas, saidas, ano, transacoesAno) {
  const css = getComputedStyle(document.documentElement);
  const colorText = css.getPropertyValue("--color-text").trim();
  const colorSaida = css.getPropertyValue("--color-danger").trim();
  const colorEntrada = css.getPropertyValue("--color-success").trim();
  const colorBg = css.getPropertyValue("--color-primary").trim();

  const mesesComValores = Array.from(
    new Set([
      ...Object.keys(entradas).filter((m) => m.startsWith(ano)),
      ...Object.keys(saidas).filter((m) => m.startsWith(ano)),
    ])
  ).sort();

  const labels = mesesComValores.map(
    (m) => nomesMeses[parseInt(m.split("-")[1], 10) - 1]
  );
  const dadosEntrada = mesesComValores.map((m) => entradas[m] || 0);
  const dadosSaida = mesesComValores.map((m) => saidas[m] || 0);

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Entradas",
          data: dadosEntrada,
          backgroundColor: colorEntrada,
        },
        {
          label: "Saídas",
          data: dadosSaida,
          backgroundColor: colorSaida,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }),
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: colorText,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 12,
            padding: 20,
          },
        },
        tooltip: {
          // Largura máxima para permitir quebra de linha
          maxWidth: 300,
          backgroundColor: colorBg,
          titleColor: colorText,
          bodyColor: colorText,
          borderColor: "#37e29b",
          borderWidth: 1,
          usePointStyle: true,
          boxPadding: 5,
          bodyPointStyle: "circle",
          bodyFont: {
            size: 12,
            weight: "400",
            lineHeight: 1.5,
          },
          callbacks: {
            title: (context) => `Mês: ${context[0].label}`,
            beforeBody: (context) => {
              const index = context[0].dataIndex;
              const mesAno = mesesComValores[index];
              const transacoesMes = transacoesAno.filter((t) =>
                t.data.startsWith(mesAno)
              );
              const entradas = transacoesMes.filter(
                (t) => t.tipo === "entrada"
              );
              const saidas = transacoesMes.filter((t) => t.tipo === "saida");

              const totalEntrada = entradas.reduce(
                (acc, t) => acc + Number(t.valor),
                0
              );
              const totalSaida = saidas.reduce(
                (acc, t) => acc + Number(t.valor),
                0
              );

              const agrupar = (transacoes) => {
                const mapa = {};
                const total = transacoes.reduce(
                  (acc, t) => acc + Number(t.valor),
                  0
                );
                for (const t of transacoes) {
                  const valor = Number(t.valor);
                  mapa[t.categoria] = (mapa[t.categoria] || 0) + valor;
                }
                return Object.entries(mapa)
                  .sort(([a], [b]) => a.localeCompare(b)) // <-- ordenação alfabética
                  .map(
                    ([categoria, valor]) =>
                      `- ${capitalize(categoria)}: ${(
                        (valor / total) *
                        100
                      ).toFixed(1)}%`
                  );
              };

              return [
                `Total Entradas: ${totalEntrada.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}`,
                ...agrupar(entradas),
                "",
                `Total Saídas: ${totalSaida.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}`,
                ...agrupar(saidas),
              ];
            },
            label: () => null,
          },
        },
      },
    },
  });
}

document.getElementById("baixarLancamentos").addEventListener("click", () => {
  console.log("clicouuu");
  fetch(`${BASE_API_URL}/baixar`, {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao baixar");
      return res.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lancamentos.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => alert("Erro ao baixar: " + err.message));
});

window.addEventListener("resize", () => {
  if (chartCategorias && ultimoStateDashboard) {
    chartCategorias.destroy();
    chartCategorias = null;
    renderizarDashboard(ultimoStateDashboard);
  }
});
