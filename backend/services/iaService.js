require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Utilitário para obter o nome do mês
function getNomeMes(numero) {
  const nomes = [
    "",
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return nomes[numero] || "";
}

async function gerarResumoFinanceiro(dadosCompletos) {
  const { transacoes, ano, mes } = dadosCompletos;
  const entradas = transacoes.filter((t) => t.tipo === "entrada");
  const saidas = transacoes.filter((t) => t.tipo === "saida");

  const totalEntradas = entradas.reduce((acc, cur) => acc + cur.valor, 0);
  const totalSaidas = saidas.reduce((acc, cur) => acc + cur.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  const nomeMes = mes ? getNomeMes(mes) : null;
  const periodoTexto = mes ? `${nomeMes}/${ano}` : `todo o ano de ${ano}`;

  const prompt = `
Você é um assistente financeiro inteligente. Analise cuidadosamente os dados a seguir e gere um resumo claro, amigável e útil sobre a situação financeira do usuário durante o período de ${periodoTexto}.

Sua resposta deve conter:

1. **"resumoFinanceiro"**: Uma análise em linguagem natural, clara e objetiva, explicando se o usuário teve superávit ou déficit, destacando hábitos financeiros positivos ou preocupantes, e observando padrões ou mudanças relevantes.
2. **"sugestoes"**: Três sugestões práticas e realistas para ajudar o usuário a melhorar seu planejamento financeiro, economizar mais ou investir melhor. Seja breve, específico e evite generalidades.
3. **"detalhes"**: Uma estrutura JSON com os totais de entradas e saídas, incluindo a divisão por categoria (agrupadas por tipo de gasto ou receita), para que o usuário possa entender onde está ganhando e gastando mais.

Responda ESTRITAMENTE com um objeto JSON VÁLIDO (sem crases, sem formatação markdown), com o seguinte formato:

{
  "resumoFinanceiro": "Texto em linguagem natural com insights",
  "sugestoes": [
    "Sugestão 1",
    "Sugestão 2",
    "Sugestão 3"
  ],
  "detalhes": {
    "entradas": {
      "total": número,
      "categorias": [
        { "categoria": "nome", "valor": número }
      ]
    },
    "saidas": {
      "total": número,
      "categorias": [
        { "categoria": "nome", "valor": número }
      ]
    }
  }
}

A seguir, os dados financeiros do usuário no período analisado:

- Entradas totais: R$ ${totalEntradas.toFixed(2)}
- Saídas totais: R$ ${totalSaidas.toFixed(2)}
- Saldo final: R$ ${saldo.toFixed(2)}

Detalhes das Entradas (agrupadas por categoria):
${JSON.stringify(entradas)}

Detalhes das Saídas (agrupadas por categoria):
${JSON.stringify(saidas)}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.95,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = await result.response;
    const texto = await response.text();

    let parsed;
    try {
      parsed = JSON.parse(texto);

      // Caso venha dentro de um campo "resumo", extrai
      if (parsed.resumo && parsed.resumo.resumoFinanceiro) {
        parsed = parsed.resumo;
      }

      return {
        resumoFinanceiro: parsed.resumoFinanceiro || "Resumo não disponível.",
        sugestoes: parsed.sugestoes || [],
        detalhes: parsed.detalhes || {
          entradas: { total: 0, categorias: [] },
          saidas: { total: 0, categorias: [] },
        },
      };
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      return {
        resumoFinanceiro:
          "Erro ao gerar o resumo financeiro. Tente novamente mais tarde.",
        sugestoes: [],
        detalhes: {
          entradas: { total: 0, categorias: [] },
          saidas: { total: 0, categorias: [] },
        },
      };
    }
  } catch (error) {
    console.error("Erro na chamada da IA:", error);
    return {
      resumoFinanceiro:
        "Erro ao gerar o resumo financeiro. Tente novamente mais tarde.",
      sugestoes: [],
      detalhes: {
        entradas: { total: 0, categorias: [] },
        saidas: { total: 0, categorias: [] },
      },
    };
  }
}

function analisarTransacoes(transacoes, mesSelecionado, anoSelecionado) {
  const entradas = transacoes.filter((t) => t.tipo === "entrada");
  const saidas = transacoes.filter((t) => t.tipo === "saida");

  const totalEntrada = entradas.reduce((acc, cur) => acc + cur.valor, 0);
  const totalSaida = saidas.reduce((acc, cur) => acc + cur.valor, 0);
  const saldo = totalEntrada - totalSaida;

  // Agrupar saídas por categoria
  const porCategoria = {};
  for (const s of saidas) {
    porCategoria[s.categoria] = (porCategoria[s.categoria] || 0) + s.valor;
  }

  // Obter categoria com maior gasto
  const categoriasOrdenadas = Object.entries(porCategoria).sort(
    (a, b) => b[1] - a[1]
  );
  const [categoriaMaisGasta, valorMaisGasto] = categoriasOrdenadas[0] || [
    "N/A",
    0,
  ];

  if (saldo < 0) {
    return `⚠️ Você gastou R$${Math.abs(saldo).toFixed(
      2
    )} a mais do que ganhou. Tente reduzir os gastos na categoria "${categoriaMaisGasta}", onde você gastou R$${valorMaisGasto.toFixed(
      2
    )}.`;
  }

  if (valorMaisGasto / totalSaida > 0.5) {
    return `💸 Mais da metade das suas despesas foram com "${categoriaMaisGasta}". Avalie se é possível reduzir esse valor.`;
  }

  return `✅ Seus gastos estão sob controle! Continue acompanhando suas finanças para manter o equilíbrio.`;
}

module.exports = { analisarTransacoes, gerarResumoFinanceiro };
