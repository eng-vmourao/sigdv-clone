/**
 * Validações por tipo de TAM
 * Cada validação retorna { valid: boolean, message: string, type: 'error'|'warning' }
 */

/**
 * Executa todas as validações de uma linha baseado na configuração do tipo de TAM
 * @param {Object} row - Dados da linha
 * @param {Array} validations - Array de regras de validação do tipo
 * @returns {Array} Array de resultados de validação com erros/avisos
 */
export function validateRow(row, validations) {
  const results = [];

  for (const v of validations) {
    const value = row[v.field];

    switch (v.rule) {
      case 'gte0':
        if (value !== null && value !== undefined && value < 0) {
          results.push({ field: v.field, message: v.message, type: 'error' });
        }
        break;

      case 'lteField': {
        const compareValue = row[v.compareField] || 0;
        if (value > compareValue) {
          results.push({ field: v.field, message: v.message, type: 'error' });
        }
        break;
      }

      case 'oneOf':
        if (value && !v.options.includes(value)) {
          results.push({ field: v.field, message: v.message, type: 'error' });
        }
        break;

      case 'warnDecrease': {
        const baseValue = row[v.baseField] || 0;
        if (value !== null && value !== undefined && value < baseValue) {
          results.push({ field: v.field, message: v.message, type: 'warning' });
        }
        break;
      }

      case 'warnIncrease': {
        const baseValue = row[v.baseField] || 0;
        if (value !== null && value !== undefined && value > baseValue) {
          results.push({ field: v.field, message: v.message, type: 'warning' });
        }
        break;
      }

      default:
        break;
    }
  }

  return results;
}

/**
 * Valida todas as linhas de uma tabela de TAM
 * @param {Array} rows - Array de linhas da tabela
 * @param {Array} validations - Regras de validação do tipo
 * @returns {Object} { hasErrors, hasWarnings, rowResults: Map<rowIndex, results[]> }
 */
export function validateTable(rows, validations) {
  const rowResults = new Map();
  let hasErrors = false;
  let hasWarnings = false;

  rows.forEach((row, index) => {
    const results = validateRow(row, validations);
    if (results.length > 0) {
      rowResults.set(index, results);
      if (results.some(r => r.type === 'error')) hasErrors = true;
      if (results.some(r => r.type === 'warning')) hasWarnings = true;
    }
  });

  return { hasErrors, hasWarnings, rowResults };
}

/**
 * Validações específicas para medição
 */
export function validateMedicaoRow(row) {
  const results = [];

  if (row.qtdMedidaPeriodo < 0) {
    results.push({ field: 'qtdMedidaPeriodo', message: 'Qtd. Medida no Período não pode ser negativa.', type: 'error' });
  }

  if (row.saldoQtd < 0) {
    results.push({ field: 'saldoQtd', message: 'Saldo de quantidade negativo — excedido!', type: 'warning' });
  }

  return results;
}

/**
 * Determina o status do saldo de medição
 * @param {number} saldo - Saldo de quantidade
 * @returns {{ label: string, type: string }}
 */
export function getSaldoStatus(saldo) {
  if (saldo > 0) return { label: 'OK', type: 'ok' };
  if (saldo === 0) return { label: 'Saldo zerado', type: 'zerado' };
  return { label: 'Saldo negativo', type: 'negativo' };
}
