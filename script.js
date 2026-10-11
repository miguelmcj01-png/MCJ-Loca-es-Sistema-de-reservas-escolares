
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
      "2A - ADM", "2B - DS",
      "3A - ADM", "3B - DS"
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
  "1A",
  "1B",
  "1C",
  "1D",
  "2A - ADM",
  "2B - DS",
  "2C",
  "3A - ADM",
  "3B - DS",
  "3C"
];

function consultarEquipamento(chave) {
  return inventario[chave] || null;
}

function consultarSalasPermitidas(chave) {
  const equipamento = consultarEquipamento(chave);

  if (!equipamento) {
    return [];
  }

  return equipamento.salasPermitidas || [...turmas];
}

function validarSolicitacao(dados) {
  const equipamento = consultarEquipamento(dados.equipamento);

  if (!equipamento) {
    return {
      valida: false,
      mensagem: "Selecione um equipamento válido."
    };
  }

  if (!turmas.includes(dados.turma)) {
    return {
      valida: false,
      mensagem: "Selecione uma turma cadastrada."
    };
  }

  if (
    equipamento.salasPermitidas &&
    !equipamento.salasPermitidas.includes(dados.turma)
  ) {
    return {
      valida: false,
      mensagem: "Este equipamento não está autorizado para essa turma."
    };
  }

  const quantidade = Number(dados.quantidade);

  if (
    !Number.isInteger(quantidade) ||
    quantidade < 1 ||
    quantidade > equipamento.quantidade
  ) {
    return {
      valida: false,
      mensagem: "Informe uma quantidade válida."
    };
  }

  if (!dados.data || !dados.horario || !dados.finalidade?.trim()) {
    return {
      valida: false,
      mensagem: "Preencha data, horário e finalidade."
    };
  }

  return {
    valida: true,
    mensagem: "Solicitação validada. Ainda precisa ser registrada e aprovada."
  };
}

console.log("MCJ Locações: inventário inicial carregado.");
