/**
 * Serviço de TAM — CRUD + numeração automática (SIGDV-09)
 * TAMs novas com quantidades zeradas (SIGDV-06)
 * Inclusão de novo item (SIGDV-10)
 */
import tams from '../data/tams';
import itensContrato from '../data/itensContrato';

// Estado local (simula backend)
let tamsState = JSON.parse(JSON.stringify(tams));
let nextId = 100000;

/**
 * Lista TAMs de um contrato
 */
export function listarTAMs(contratoId) {
  return tamsState[contratoId] || [];
}

/**
 * Obtém uma TAM pelo ID
 */
export function getTAM(tamId) {
  for (const contratoId of Object.keys(tamsState)) {
    const tam = tamsState[contratoId].find(t => t.id === tamId);
    if (tam) {
      // Garantir que todos os itens do contrato estão na TAM (mesmo que não manipulados)
      const contratoItens = itensContrato[contratoId] || [];
      const tamItensMap = new Map(tam.itens.map(i => [i.codigoItem, i]));
      
      tam.itens = contratoItens.map(item => {
        if (tamItensMap.has(item.codigoItem)) {
          return tamItensMap.get(item.codigoItem);
        }
        // Retorna item zerado
        const base = {
          codigoItem: item.codigoItem,
          descricao: item.descricao,
          qtdVigente: item.qtdVigente,
          precoUnitVigente: item.precoUnitVigente,
        };
        switch (tam.tipo) {
          case 'PRORROGACAO':
          case 'PRORROGACAO_EXCEPCIONALIDADE':
            return { ...base, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 };
          case 'ACRESCIMO':
            return { ...base, qtdAcrescida: 0 };
          case 'SUPRESSAO':
            return { ...base, qtdSuprimida: 0 };
          case 'ANULACAO':
            return { ...base, anularMedicao: '', anularPeriodo: '' };
          case 'REAJUSTE':
            return { ...base, reajUnitPerc: 0, reajUnitValor: 0 };
          case 'DESCONTO':
            return { ...base, descUnitPerc: 0, descUnitValor: 0 };
          default:
            return base;
        }
      });
      return tam;
    }
  }
  return null;
}

/**
 * Obtém o próximo número de TAM para um contrato (SIGDV-09)
 */
export function getProximoNumeroTAM(contratoId, medicaoInicio, tipo) {
  const tamsList = tamsState[contratoId] || [];
  if (tamsList.length === 0) return 1;
  
  if (tipo !== 'PRORROGACAO' && medicaoInicio) {
    const existing = tamsList.find(t => t.medicaoInicio === medicaoInicio && t.tipo !== 'PRORROGACAO');
    if (existing) return existing.numero;
  }
  
  return Math.max(...tamsList.map(t => t.numero)) + 1;
}

/**
 * Cria nova TAM com quantidades zeradas (SIGDV-06)
 */
export function criarTAM(contratoId, tipo, medicaoInicio, dataInicio, observacao, inicioContrato, terminoContrato, periodo) {
  const itens = itensContrato[contratoId] || [];
  const numero = getProximoNumeroTAM(contratoId, medicaoInicio, tipo);

  // Cria itens zerados baseados nos itens do contrato (SIGDV-06)
  const itensZerados = itens.map(item => {
    const base = {
      codigoItem: item.codigoItem,
      descricao: item.descricao,
      qtdVigente: item.qtdVigente,
      precoUnitVigente: item.precoUnitVigente,
    };

    // Inicializa campos específicos do tipo com zero
    switch (tipo) {
      case 'PRORROGACAO':
      case 'PRORROGACAO_EXCEPCIONALIDADE':
        return { ...base, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 };
      case 'ACRESCIMO':
        return { ...base, qtdAcrescida: 0 };
      case 'SUPRESSAO':
        return { ...base, qtdSuprimida: 0 };
      case 'ANULACAO':
        return { ...base, anularMedicao: '', anularPeriodo: '' };
      case 'REAJUSTE':
        return { ...base, reajUnitPerc: 0, reajUnitValor: 0 };
      case 'DESCONTO':
        return { ...base, descUnitPerc: 0, descUnitValor: 0 };
      default:
        return base;
    }
  });

  const novaTAM = {
    id: nextId++,
    numero,
    contratoId,
    tipo,
    medicaoInicio,
    dataInicio,
    dataTermino,
    inicioContrato: tipo === 'PRORROGACAO' ? inicioContrato : undefined,
    terminoContrato: tipo === 'PRORROGACAO' ? terminoContrato : undefined,
    periodo: periodo || 1,
    observacao,
    baseMedicao: 0,
    itens: itensZerados,
  };

  if (!tamsState[contratoId]) tamsState[contratoId] = [];
  tamsState[contratoId].push(novaTAM);

  return novaTAM;
}

/**
 * Atualiza TAM (cabeçalho e itens)
 */
export function atualizarTAM(tamId, dados) {
  for (const contratoId of Object.keys(tamsState)) {
    const tam = tamsState[contratoId].find(t => t.id === tamId);
    if (tam) {
      if (dados.tipo !== undefined) tam.tipo = dados.tipo;
      if (dados.medicaoInicio !== undefined) tam.medicaoInicio = dados.medicaoInicio;
      if (dados.dataInicio !== undefined) tam.dataInicio = dados.dataInicio;
      if (dados.inicioContrato !== undefined) tam.inicioContrato = dados.inicioContrato;
      if (dados.terminoContrato !== undefined) tam.terminoContrato = dados.terminoContrato;
      if (dados.observacao !== undefined) tam.observacao = dados.observacao;
      if (dados.periodo !== undefined) tam.periodo = dados.periodo;
      if (dados.itens !== undefined) tam.itens = dados.itens;
      return tam;
    }
  }
  return null;
}

/**
 * Atualiza itens de uma TAM

 */
export function atualizarItensTAM(tamId, itensAtualizados) {
  for (const contratoId of Object.keys(tamsState)) {
    const tam = tamsState[contratoId].find(t => t.id === tamId);
    if (tam) {
      tam.itens = itensAtualizados;
      return tam;
    }
  }
  return null;
}

/**
 * Adiciona novo item à TAM (SIGDV-10)
 * Permitido apenas em Prorrogação, Acréscimo e Supressão
 */
export function adicionarNovoItem(tamId, novoItem) {
  const tam = getTAM(tamId);
  if (!tam) return null;

  const tiposPermitidos = ['PRORROGACAO', 'PRORROGACAO_EXCEPCIONALIDADE', 'ACRESCIMO', 'SUPRESSAO'];
  if (!tiposPermitidos.includes(tam.tipo)) {
    throw new Error('Inclusão de novo item não é permitida para este tipo de TAM.');
  }

  // Verifica se o item já existe
  if (tam.itens.some(i => i.codigoItem === novoItem.codigoItem)) {
    throw new Error(`Item ${novoItem.codigoItem} já existe nesta TAM.`);
  }

  tam.itens.push({
    ...novoItem,
    origemTAM: true, // Flag para rastrear item incluído por TAM
  });

  return tam;
}

/**
 * Exclui uma TAM
 */
export function excluirTAM(tamId) {
  for (const contratoId of Object.keys(tamsState)) {
    const index = tamsState[contratoId].findIndex(t => t.id === tamId);
    if (index >= 0) {
      tamsState[contratoId].splice(index, 1);
      return true;
    }
  }
  return false;
}

/**
 * Reset para testes
 */
export function resetTAMs() {
  tamsState = JSON.parse(JSON.stringify(tams));
}

export default { listarTAMs, getTAM, criarTAM, atualizarItensTAM, adicionarNovoItem, excluirTAM, getProximoNumeroTAM };
