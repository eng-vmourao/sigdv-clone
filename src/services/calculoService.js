/**
 * Serviço centralizado de cálculos financeiros (SIGDV-02)
 * Uma única fonte de verdade para: valor total contratado, total executado, saldo
 */
import contratos from '../data/contratos';
import itensContrato from '../data/itensContrato';
import tams from '../data/tams';
import medicoes from '../data/medicoes';
import { TAM_TYPES } from '../config/tamTypes';

/**
 * Calcula o valor total vigente de um contrato considerando TAMs aplicáveis
 * @param {number} contratoId
 * @returns {{ valorTotalContratado, totalExecutado, saldoContrato, itensVigentes }}
 */
export function calcularResumoContrato(contratoId) {
  const contrato = contratos.find(c => c.id === contratoId);
  if (!contrato) return null;

  const itens = itensContrato[contratoId] || [];
  const tamsList = tams[contratoId] || [];
  const medicoesList = medicoes[contratoId] || [];

  // Calcula itens vigentes aplicando TAMs
  const itensVigentes = calcularItensVigentes(itens, tamsList);

  // Valor total contratado = soma dos valores vigentes + ajuste de centavos
  const valorTotalContratado = itensVigentes.reduce((sum, item) => {
    return sum + (item.qtdVigente * item.precoUnitVigente);
  }, 0) + (contrato.ajusteCentavos || 0);

  // Total executado e parcelas
  const totalMedicao = medicoesList.reduce((sum, med) => sum + (med.medicaoR$ || 0), 0);
  const totalReajuste = medicoesList.reduce((sum, med) => sum + (med.reajusteR$ || 0), 0);
  const totalDesconto = medicoesList.reduce((sum, med) => sum + (med.descontoR$ || 0), 0);
  
  const totalExecutado = totalMedicao + totalReajuste - totalDesconto;

  // Saldo
  const saldoContrato = valorTotalContratado - totalExecutado;

  // % Executado
  const percentualExecutado = valorTotalContratado > 0
    ? (totalExecutado / valorTotalContratado) * 100
    : 0;

  return {
    contrato,
    valorTotalContratado,
    totalExecutado,
    totalMedicao,
    totalReajuste,
    totalDesconto,
    saldoContrato,
    percentualExecutado,
    itensVigentes,
    totalMedicoes: medicoesList.length,
    totalTams: tamsList.length,
  };
}

/**
 * Aplica TAMs aos itens do contrato para obter quantidades e preços vigentes
 */
function calcularItensVigentes(itensBase, tamsList) {
  // Cria cópia dos itens
  const vigentes = itensBase.map(item => ({ ...item }));

  // Aplica cada TAM em ordem cronológica
  const tamsOrdenadas = [...tamsList].sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio));

  for (const tam of tamsOrdenadas) {
    if (!tam.itens || tam.itens.length === 0) continue;
    const config = TAM_TYPES[tam.tipo];
    if (!config) continue;

    for (const tamItem of tam.itens) {
      const vigente = vigentes.find(v => v.codigoItem === tamItem.codigoItem);
      if (!vigente) continue;

      // Aplica cálculos baseado no tipo de TAM
      const calculado = config.calcRow({
        ...tamItem,
        qtdVigente: vigente.qtdVigente,
        precoUnitVigente: vigente.precoUnitVigente,
      });

      // Atualiza item vigente
      if (calculado.qtdFinal !== undefined) {
        vigente.qtdVigente = calculado.qtdFinal;
      }
      if (calculado.precoUnitFinal !== undefined) {
        vigente.precoUnitVigente = calculado.precoUnitFinal;
      }
    }
  }

  return vigentes;
}

/**
 * Calcula resumo de medição específica
 */
export function calcularResumoMedicao(contratoId, medicaoNumero) {
  const medicoesList = medicoes[contratoId] || [];
  const medicao = medicoesList.find(m => m.numero === medicaoNumero);
  if (!medicao) return null;

  const medicoesAnteriores = medicoesList.filter(m => m.numero < medicaoNumero);

  const medicaoAcumuladaAnterior = medicoesAnteriores.reduce((sum, m) =>
    sum + (m.medicaoR$ || 0), 0);
  const reajusteAcumulado = medicoesAnteriores.reduce((sum, m) =>
    sum + (m.reajusteR$ || 0), 0);
  const descontoAcumulado = medicoesAnteriores.reduce((sum, m) =>
    sum + (m.descontoR$ || 0), 0);

  const resumoContrato = calcularResumoContrato(contratoId);

  return {
    medicao,
    medicaoAtual: medicao.numero,
    percentualExecutado: resumoContrato?.percentualExecutado || 0,
    medicaoR$: medicao.medicaoR$,
    reajusteR$: medicao.reajusteR$,
    medicaoMaisReajuste: (medicao.medicaoR$ || 0) + (medicao.reajusteR$ || 0),
    descontosR$: medicao.descontoR$,
    totalGeralMedReajDesc: (medicao.medicaoR$ || 0) + (medicao.reajusteR$ || 0) - (medicao.descontoR$ || 0),
    valorTotalContratado: resumoContrato?.valorTotalContratado || 0,
    saldoContrato: resumoContrato?.saldoContrato || 0,
  };
}

export default { calcularResumoContrato, calcularResumoMedicao };
