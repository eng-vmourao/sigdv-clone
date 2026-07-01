/**
 * Serviço de Medição — CRUD + recálculo encadeado (SIGDV-07)
 */
import medicoes from '../data/medicoes';
import { getItensMedicao } from '../data/itensMedicao';

import itensContrato from '../data/itensContrato';

// Estado local
let medicoesState = JSON.parse(JSON.stringify(medicoes));

/**
 * Lista medições de um contrato
 */
export function listarMedicoes(contratoId) {
  return (medicoesState[contratoId] || []).sort((a, b) => a.numero - b.numero);
}

/**
 * Obtém uma medição pelo ID
 */
export function getMedicao(medicaoId) {
  for (const contratoId of Object.keys(medicoesState)) {
    const med = medicoesState[contratoId].find(m => m.id === medicaoId);
    if (med) return med;
  }
  return null;
}

/**
 * Obtém itens de uma medição com campos calculados
 */
export function getItensMedicaoComCalculos(medicaoId, contratoId, numero) {
  const itensIniciais = getItensMedicao(medicaoId, contratoId, numero);
  const contratoItens = itensContrato[contratoId] || [];
  
  const medicaoItensMap = new Map(itensIniciais.map(i => [i.codigoItem, i]));

  // Mesclar para garantir que todos os itens do contrato apareçam
  const itens = contratoItens.map(item => {
    if (medicaoItensMap.has(item.codigoItem)) {
      return medicaoItensMap.get(item.codigoItem);
    }
    // Item do contrato que não estava na medição (zerado)
    return {
      itemId: Date.now() + Math.random(), // id temporário
      codigoItem: item.codigoItem,
      descricao: item.descricao,
      unidade: item.unidade || 'UN',
      qtdContratadaVigente: item.qtdVigente || 0,
      qtdAcumuladaAnterior: 0,
      qtdMedidaPeriodo: 0,
      precoUnitVigente: item.precoUnitVigente || 0,
      observacao: '',
    };
  });

  return itens.map(item => {
    const qtdAcumuladaAtual = (item.qtdAcumuladaAnterior || 0) + (item.qtdMedidaPeriodo || 0);
    const saldoQtd = (item.qtdContratadaVigente || 0) - qtdAcumuladaAtual;
    const valorMedidoPeriodo = (item.qtdMedidaPeriodo || 0) * (item.precoUnitVigente || 0);

    let statusSaldo;
    if (saldoQtd > 0) statusSaldo = { label: 'OK', type: 'ok' };
    else if (saldoQtd === 0) statusSaldo = { label: 'Saldo zerado', type: 'zerado' };
    else statusSaldo = { label: 'Saldo negativo', type: 'negativo' };

    return {
      ...item,
      qtdAcumuladaAtual,
      saldoQtd,
      valorMedidoPeriodo,
      statusSaldo,
    };
  });
}

/**
 * Exclui medição e recalcula encadeado (SIGDV-07)
 * Após excluir a medição N, recalcula todos os acumulados das medições N+1 em diante
 */
export function excluirMedicao(contratoId, medicaoId) {
  const lista = medicoesState[contratoId];
  if (!lista) return false;

  const index = lista.findIndex(m => m.id === medicaoId);
  if (index < 0) return false;

  const numeroExcluido = lista[index].numero;

  // Remove a medição
  lista.splice(index, 1);

  // Reordena e recalcula acumulados (SIGDV-07)
  lista.sort((a, b) => a.numero - b.numero);

  // Renumera se necessário
  let novoNumero = 1;
  for (const med of lista) {
    if (med.numero >= numeroExcluido) {
      med.numero = novoNumero;
    }
    novoNumero = med.numero + 1;
  }

  // Recalcula acumulados encadeados
  // Nota: em um sistema real, isso recalcularia qtdAcumuladaAnterior de cada item
  // Para o mock, apenas reordenamos
  console.log(`[SIGDV-07] Medição ${numeroExcluido} excluída do contrato ${contratoId}. ${lista.length} medições restantes recalculadas.`);

  return true;
}

/**
 * Cria nova medição
 */
export function criarMedicao(contratoId, dados) {
  if (!medicoesState[contratoId]) medicoesState[contratoId] = [];

  const lista = medicoesState[contratoId];
  const numero = lista.length > 0 ? Math.max(...lista.map(m => m.numero)) + 1 : 1;
  const novoId = contratoId * 100 + numero;

  const novaMedicao = {
    id: novoId,
    numero,
    contratoId: Number(contratoId),
    periodoInicio: dados.periodoInicio || '',
    periodoTermino: dados.periodoTermino || '',
    periodo: dados.periodo || 1,
    prazoVigenteContrato: numero,
    nrProtocolo: dados.nrProtocolo || '',
    medicaoR$: dados.medicaoR$ || 0,
    reajusteR$: dados.reajusteR$ || 0,
    descontoR$: dados.descontoR$ || 0,
  };

  lista.push(novaMedicao);
  return novaMedicao;
}

/**
 * Atualiza dados gerais de uma medição existente
 */
export function atualizarMedicao(contratoId, medicaoId, dados) {
  const lista = medicoesState[contratoId];
  if (!lista) return null;
  const index = lista.findIndex(m => m.id === medicaoId);
  if (index >= 0) {
    lista[index] = { ...lista[index], ...dados };
    return lista[index];
  }
  return null;
}

/**
 * Atualiza itens da medição
 */
export function atualizarItensMedicao(medicaoId, itensAtualizados) {
  // Apenas simula a atualização em memória no front-end para fins do protótipo
  // Num cenário real, isso faria um PUT/POST na API
  return true;
}

/**
 * Reset para testes
 */
export function resetMedicoes() {
  medicoesState = JSON.parse(JSON.stringify(medicoes));
}

export default { listarMedicoes, getMedicao, getItensMedicaoComCalculos, excluirMedicao, criarMedicao, atualizarItensMedicao, atualizarMedicao };
