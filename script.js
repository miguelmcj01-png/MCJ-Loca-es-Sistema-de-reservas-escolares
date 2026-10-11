
const inventario = {
  notebooksComuns: {
    nome: "Notebooks comuns",
    quantidade: 60,
    salasPermitidas: [
      "1A", "1B", "1C", "1D",
      "2A - ADM", "2B - DS", "2C",
      "3A - ADM", "3B - DS", "3C"
    ]
  },
  notebooksTecnicos: {
    nome: "Notebooks do curso técnico",
    quantidade: 35,
    salasPermitidas: [
      "2A - ADM", "2B - DS", "3A - ADM", "3B - DS"
    ]
  },
  chromebooks: {
    nome: "Chromebooks",
    quantidade: 25
  },
  tablets: {
    nome: "Tablets",
    quantidade: 12
  },
  computadores: {
    nome: "Computadores da sala de informática",
    quantidade: 25
  },
  salaInformatica: {
    nome: "Sala de informática",
    quantidade: 1
  }
};

const turmas = [
  "1A", "1B", "1C", "1D",
  "2A - ADM", "2B - DS", "2C",
  "3A - ADM", "3B - DS", "3C"
];

const CHAVE_RESERVAS = "mcjLocacoesReservas";

const catalogo = document.getElementById("catalogo");
const seletorEquipamento = document.getElementById("equipamento");
const seletorTurma = document.getElementById("turma");
const formulario = document.getElementById("form-reserva");
const mensagem = document.getElementById("mensagem-reserva");
const listaReservas = document.getElementById("lista-reservas");

function consultarEquipamento(chave) {
  return inventario[chave] || null;
}

function obterReservas() {
  try {
    const dados = JSON.parse(
      localStorage.getItem(CHAVE_RESERVAS) || "[]"
    );

    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function salvarReservas(reservas) {
  localStorage.setItem(CHAVE_RESERVAS, JSON.stringify(reservas));
}

function horarioSobrepoe(inicioA, fimA, inicioB, fimB) {
  return inicioA < fimB && inicioB < fimA;
}

function mesmaFaixaDeTempo(a, b) {
  return a.data === b.data &&
    horarioSobrepoe(a.inicio, a.fim, b.inicio, b.fim);
}

function adicionarOpcaoComputadores() {
  const existe = [...seletorEquipamento.options].some(
    opcao => opcao.value === "computadores"
  );

  if (!existe) {
    const opcao = document.createElement("option");
    opcao.value = "computadores";
    opcao.textContent = "Computadores da sala de informática";
    seletorEquipamento.insertBefore(
      opcao,
      seletorEquipamento.querySelector('option[value="salaInformatica"]')
    );
  }
}

function atualizarTurmas() {
  const equipamento = consultarEquipamento(seletorEquipamento.value);
  const turmaAnterior = seletorTurma.value;

  seletorTurma.replaceChildren();

  const inicial = document.createElement("option");
  inicial.value = "";
  inicial.textContent = "Selecione uma turma";
  seletorTurma.appendChild(inicial);

  const permitidas = equipamento?.salasPermitidas || turmas;

  permitidas.forEach(turma => {
    const opcao = document.createElement("option");
    opcao.value = turma;
    opcao.textContent = turma;
    seletorTurma.appendChild(opcao);
  });

  if (permitidas.includes(turmaAnterior)) {
    seletorTurma.value = turmaAnterior;
  }

  const campoQuantidade = document.getElementById("quantidade");

  if (equipamento?.quantidade) {
    campoQuantidade.max = equipamento.quantidade;
  } else {
    campoQuantidade.removeAttribute("max");
  }

  if (seletorEquipamento.value === "salaInformatica") {
    campoQuantidade.value = "1";
    campoQuantidade.min = "1";
    campoQuantidade.max = "1";
    campoQuantidade.readOnly = true;
  } else {
    campoQuantidade.readOnly = false;
    campoQuantidade.min = "1";
    if (equipamento) {
      campoQuantidade.max = equipamento.quantidade;
    }
  }
}

function renderizarCatalogo() {
  catalogo.replaceChildren();

  Object.entries(inventario).forEach(([chave, equipamento]) => {
    const card = document.createElement("article");
    card.className = "cartao-recurso";

    const titulo = document.createElement("h3");
    titulo.textContent = equipamento.nome;

    const quantidade = document.createElement("p");
    quantidade.textContent =
      `Quantidade cadastrada: ${equipamento.quantidade}`;

    const descricao = document.createElement("p");

    if (chave === "notebooksTecnicos") {
      descricao.textContent =
        "Uso permitido para 2A - ADM, 2B - DS, 3A - ADM e 3B - DS.";
    } else if (chave === "notebooksComuns") {
      descricao.textContent = "Disponíveis para todas as turmas cadastradas.";
    } else if (chave === "salaInformatica") {
      descricao.textContent =
        "Reserva por horário, sujeita à verificação de conflitos.";
    } else {
      descricao.textContent = "Recurso do inventário escolar.";
    }

    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = "Recurso escolar";

    card.append(titulo, quantidade, descricao, etiqueta);
    catalogo.appendChild(card);
  });
}

function exibirMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo === "erro"
    ? "mensagem-erro"
    : "mensagem-sucesso";
}

function criarParagrafo(texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  return p;
}

function renderizarReservas() {
  const reservas = obterReservas();
  listaReservas.replaceChildren();

  if (reservas.length === 0) {
    listaReservas.appendChild(
      criarParagrafo("Nenhuma solicitação registrada neste navegador.")
    );
    return;
  }

  [...reservas].reverse().forEach(reserva => {
    const item = document.createElement("article");
    item.className = "item-reserva";

    const titulo = document.createElement("h3");
    titulo.textContent = reserva.recurso;

    item.append(
      titulo,
      criarParagrafo(`Responsável: ${reserva.responsavel}`),
      criarParagrafo(`Turma: ${reserva.turma}`),
      criarParagrafo(`Quantidade: ${reserva.quantidade}`),
      criarParagrafo(`Data: ${reserva.data}`),
      criarParagrafo(`Horário: ${reserva.inicio} às ${reserva.fim}`),
      criarParagrafo(`Finalidade: ${reserva.finalidade}`),
      criarParagrafo(`Situação: ${reserva.status}`)
    );

    listaReservas.appendChild(item);
  });
}

function validarSolicitacao(dados) {
  const equipamento = consultarEquipamento(dados.equipamento);

  if (!equipamento) {
    return "Selecione um recurso válido.";
  }

  if (!turmas.includes(dados.turma)) {
    return "Selecione uma turma cadastrada.";
  }

  if (
    equipamento.salasPermitidas &&
    !equipamento.salasPermitidas.includes(dados.turma)
  ) {
    return "Este equipamento não está autorizado para essa turma.";
  }

  const quantidade = Number(dados.quantidade);

  if (
    !Number.isInteger(quantidade) ||
    quantidade < 1 ||
    quantidade > equipamento.quantidade
  ) {
    return "Informe uma quantidade válida para o recurso.";
  }

  if (dados.equipamento === "salaInformatica" && quantidade !== 1) {
    return "A sala de informática permite uma reserva por solicitação.";
  }

  if (!dados.responsavel.trim()) {
    return "Informe o nome do professor ou funcionário.";
  }

  if (!dados.data || !dados.inicio || !dados.fim || !dados.finalidade.trim()) {
    return "Preencha todos os campos obrigatórios.";
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataReserva = new Date(`${dados.data}T00:00:00`);

  if (Number.isNaN(dataReserva.getTime()) || dataReserva < hoje) {
    return "Escolha uma data de hoje em diante.";
  }

  if (dados.inicio >= dados.fim) {
    return "O horário final deve ser posterior ao inicial.";
  }

  const reservas = obterReservas();

  const conflitos = reservas.filter(reserva =>
    reserva.equipamento === dados.equipamento &&
    mesmaFaixaDeTempo(reserva, dados)
  );

  if (dados.equipamento === "salaInformatica" && conflitos.length > 0) {
    return "Já existe uma solicitação para a sala nesse horário.";
  }

  const quantidadeOcupada = conflitos.reduce(
    (total, reserva) => total + Number(reserva.quantidade || 0),
    0
  );

  if (quantidadeOcupada + quantidade > equipamento.quantidade) {
    return "A quantidade solicitada excede o estoque disponível nesse horário.";
  }

  return "";
}

formulario.addEventListener("submit", evento => {
  evento.preventDefault();

  const dados = {
    responsavel: document.getElementById("responsavel").value.trim(),
    equipamento: seletorEquipamento.value,
    turma: seletorTurma.value,
    quantidade: Number(document.getElementById("quantidade").value),
    data: document.getElementById("data").value,
    inicio: document.getElementById("inicio").value,
    fim: document.getElementById("fim").value,
    finalidade: document.getElementById("finalidade").value.trim()
  };

  const erro = validarSolicitacao(dados);

  if (erro) {
    exibirMensagem(erro, "erro");
    return;
  }

  const equipamento = consultarEquipamento(dados.equipamento);

  const novaReserva = {
    ...dados,
    recurso: equipamento.nome,
    status: "Pendente",
    criadaEm: new Date().toISOString()
  };

  try {
    const reservas = obterReservas();
    reservas.push(novaReserva);
    salvarReservas(reservas);
  } catch {
    exibirMensagem(
      "Não foi possível salvar. O armazenamento do navegador pode estar cheio ou bloqueado.",
      "erro"
    );
    return;
  }

  exibirMensagem(
    "Solicitação registrada neste navegador. Ela ainda precisa ser analisada pela escola.",
    "sucesso"
  );

  formulario.reset();
  atualizarTurmas();
  renderizarReservas();
});

seletorEquipamento.addEventListener("change", atualizarTurmas);

adicionarOpcaoComputadores();
atualizarTurmas();
renderizarCatalogo();
renderizarReservas();

const campoData = document.getElementById("data");
const agora = new Date();
const ano = agora.getFullYear();
const mes = String(agora.getMonth() + 1).padStart(2, "0");
const dia = String(agora.getDate()).padStart(2, "0");
campoData.min = `${ano}-${mes}-${dia}`;

console.log("MCJ Locações: interface inicializada.");
