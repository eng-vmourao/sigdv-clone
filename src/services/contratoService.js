/**
 * Serviço de Contrato — CRUD + Lei Aplicável (SIGDV-01)
 */
import contratos from '../data/contratos';

// Estado local
let contratosState = [...contratos];

/**
 * Lista todos os contratos, com filtros opcionais
 */
export function listarContratos(filtros = {}) {
  let resultado = [...contratosState];

  if (filtros.leiAplicavel && filtros.leiAplicavel !== 'TODOS') {
    resultado = resultado.filter(c => c.leiAplicavel === filtros.leiAplicavel);
  }

  if (filtros.status && filtros.status !== 'TODOS') {
    resultado = resultado.filter(c => c.status === filtros.status);
  }

  if (filtros.regional) {
    resultado = resultado.filter(c =>
      c.regional.toLowerCase().includes(filtros.regional.toLowerCase())
    );
  }

  if (filtros.busca) {
    const busca = filtros.busca.toLowerCase();
    resultado = resultado.filter(c =>
      c.numero.toLowerCase().includes(busca) ||
      c.contratada.toLowerCase().includes(busca) ||
      c.objetoResumido.toLowerCase().includes(busca)
    );
  }

  return resultado;
}

/**
 * Obtém contrato pelo ID
 */
export function getContrato(contratoId) {
  return contratosState.find(c => c.id === Number(contratoId)) || null;
}

/**
 * Atualiza Lei Aplicável do contrato (SIGDV-01)
 */
export function atualizarLeiAplicavel(contratoId, leiAplicavel) {
  const contrato = contratosState.find(c => c.id === Number(contratoId));
  if (contrato) {
    contrato.leiAplicavel = leiAplicavel;
    return contrato;
  }
  return null;
}

/**
 * Atualiza dados do contrato
 */
export function atualizarContrato(contratoId, dados) {
  const index = contratosState.findIndex(c => c.id === Number(contratoId));
  if (index >= 0) {
    contratosState[index] = { ...contratosState[index], ...dados };
    return contratosState[index];
  }
  return null;
}

export default { listarContratos, getContrato, atualizarLeiAplicavel, atualizarContrato };
