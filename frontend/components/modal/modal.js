export function ativarModal(config) {
  // Injetar CSS dinamicamente
  const cssId = "modal.css";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "components/modal/modal.css";
    document.head.appendChild(link);
  }

  const tipoSelect = document.getElementById("modal-tipo");
  const categoriaSelect = document.getElementById("modal-categoria");

  const modal = document.getElementById(config.modalId || "modal-form");
  const btnAdicionar = document.getElementById(
    config.btnAdicionarId || "btn-adicionar"
  );
  const btnCancelar = document.getElementById(
    config.btnCancelarId || "btn-cancelar"
  );
  const btnFechar = document.getElementById(
    config.btnFecharId || "modal-close"
  );
  const formModal = document.getElementById(config.formId || "form-modal");
  const inputId = document.getElementById(config.inputId || "modal-id");

  tipoSelect.addEventListener("change", (e) => {
    atualizarCategoriasPorTipo(e.target.value);
  });

  function obterTitulo(tipo, isEdicao = false) {
    const tipoTexto = tipo === "entrada" ? "Receita" : "Despesa";
    return isEdicao ? `Editar ${tipoTexto}` : `Incluir ${tipoTexto}`;
  }

  btnAdicionar.addEventListener("click", () => {
    formModal.reset();

    const tipo = config.tipoPadrao || "saida";

    // Atualiza título
    modal.querySelector("h3").textContent = obterTitulo(tipo, false);
    // Define o tipo padrão, se houver
    if (config.tipoPadrao) {
      tipoSelect.value = config.tipoPadrao;
      atualizarCategoriasPorTipo(config.tipoPadrao); // aplica categorias ao abrir
    }

    modal.classList.add("show");
  });

  btnCancelar.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  btnFechar.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  formModal.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const dados = Object.fromEntries(new FormData(formModal));
    const isEdit = !!dados.id;
    const url = isEdit ? `${config.apiBaseUrl}/${dados.id}` : config.apiBaseUrl;
    const method = isEdit ? "PUT" : "POST";
    if (isEdit) delete dados.id;

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.ok) {
      modal.classList.remove("show");
      formModal.reset();
      config.onSalvar?.();
    } else {
      const erro = await res.json();
      alert(erro.erro || "Erro ao salvar.");
    }
    return false;
  });
}

export function atualizarCategoriasPorTipo(tipo) {
  const categoriaSelect = document.getElementById("modal-categoria");

  const categoriasEntrada = [
    { value: "comissão", label: "Comissão" },
    { value: "ferias", label: "Férias" },
    { value: "salário", label: "Salário" },
    { value: "outras receitas", label: "Outras Receitas" },
  ];

  const categoriasSaida = [
    { value: "alimentação", label: "Alimentação" },
    { value: "carro", label: "Carro" },
    { value: "educação", label: "Educação" },
    { value: "lazer", label: "Lazer" },
    { value: "moradia", label: "Moradia" },
    { value: "saude e bem esta", label: "Saúde e Bem-Estar" },
    { value: "transporte", label: "Transporte" },
    { value: "outras despesas", label: "Outras Despesas" },
  ];

  const categorias = tipo === "entrada" ? categoriasEntrada : categoriasSaida;

  categoriaSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = "Selecione uma opção";
  categoriaSelect.appendChild(placeholder);

  categorias.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.value;
    option.textContent = cat.label;
    categoriaSelect.appendChild(option);
  });
}
